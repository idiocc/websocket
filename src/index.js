import { createHash } from 'crypto'
import { b } from 'erte'

/**
 * Establishes WebSocket Connection Between Client And Server. Returns the object containing ID of connected clients, with the `(event, message)` callback to send them a message.
 * @param {import('http').Server} server The HTTP server.
 * @param {Config} [config] Options for the program.
 * @param {boolean} [config.log=true] Whether to log on connect and disconnect. Default `true`.
 * @param {(clientID: string) => void} [config.onMessage] The callback when a message is received from a client.
 * @param {(clientID: string, message: string) => void} [config.onConnect] The callback when a client is connected.
 */
export default function websocket(server, config = {}) {
  const {
    onMessage = () => {},
    onConnect = () => {},
    log = true,
  } = config
  const clients = {}
  server.on('upgrade', (req, socket) => {
    if (req.headers['upgrade'] !== 'websocket') {
      socket.end('HTTP/1.1 400 Bad Request')
      return
    }
    const acceptKey = req.headers['sec-websocket-key']
    const hash = generateAcceptValue(acceptKey)
    const responseHeaders = [
      'HTTP/1.1 101 Web Socket Protocol Handshake',
      'Upgrade: WebSocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${hash}`,
    ]
    // Read the subprotocol from the client request headers:
    const protocol = req.headers['sec-websocket-protocol']
    const protocols = !protocol ? [] : protocol.split(',').map(s => s.trim())
    if (protocols.includes('json')) {
      responseHeaders.push('Sec-WebSocket-Protocol: json')
    }
    socket.write(responseHeaders.join('\r\n') + '\r\n\r\n')
    log && console.log(b('Client connected.', 'green'))
    socket.on('data', buffer => {
      const message = parseMessage(buffer)
      if (message) {
        onMessage(acceptKey, message)
      } else if (message === null) {
        delete clients[acceptKey]
        log && console.log(b('Client disconnected.', 'red'))
      }
    })
    clients[acceptKey] = (event, message) => {
      socket.write(constructReply({ event, message }))
    }
    onConnect(acceptKey)
  })
  return clients
}

function generateAcceptValue (key) {
  return createHash('sha1')
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`, 'binary')
    .digest('base64')
}

function parseMessage(buffer) {
  const firstByte = buffer.readUInt8(0)
  const isFinalFrame = Boolean((firstByte >>> 7) & 0x1)
  const [reserved1, reserved2, reserved3] = [ Boolean((firstByte >>> 6) & 0x1), Boolean((firstByte >>> 5) & 0x1), Boolean((firstByte >>> 4) & 0x1) ]
  const opCode = firstByte & 0xF
  // We can return null to signify that this is a connection termination frame
  if (opCode === 0x8)
    return null
  // We only care about text frames from this point onward
  if (opCode !== 0x1)
    return
  const secondByte = buffer.readUInt8(1)
  const isMasked = Boolean((secondByte >>> 7) & 0x1)
  // Keep track of our current position as we advance through the buffer
  let currentOffset = 2; let payloadLength = secondByte & 0x7F
  if (payloadLength > 125) {
    if (payloadLength === 126) {
      payloadLength = buffer.readUInt16BE(currentOffset)
      currentOffset += 2
    } else {
      // 127
      // If this has a value, the frame size is ridiculously huge!
      const leftPart = buffer.readUInt32BE(currentOffset)
      const rightPart = buffer.readUInt32BE(currentOffset += 4)
      throw new Error('Large payloads not currently implemented')
    }
  }
  let maskingKey
  if (isMasked) {
    maskingKey = buffer.readUInt32BE(currentOffset)
    currentOffset += 4
  }
  // Allocate somewhere to store the final message data
  const data = Buffer.alloc(payloadLength)
  // Only unmask the data if the masking bit was set to 1
  if (isMasked) {
    // Loop through the source buffer one byte at a time, keeping track of which
    // byte in the masking key to use in the next XOR calculation
    for (let i = 0, j = 0; i < payloadLength; ++i, j = i % 4) {
    // Extract the correct byte mask from the masking key
      const shift = j == 3 ? 0 : (3 - j) << 3
      const mask = (shift == 0 ? maskingKey : (maskingKey >>> shift)) & 0xFF
      // Read a byte from the source buffer
      const source = buffer.readUInt8(currentOffset++) // XOR the source byte and write the result to the data buffer
      data.writeUInt8(mask ^ source, i) }
  } else {
    // Not masked - we can just read the data as-is
    buffer.copy(data, 0, currentOffset++)
  }
  return `${data}`
}

function constructReply (data) {
  // Convert the data to JSON and copy it into a buffer
  const json = JSON.stringify(data)
  const jsonByteLength = Buffer.byteLength(json)
  // Note: we're not supporting > 65535 byte payloads at this stage
  const lengthByteCount = jsonByteLength < 126 ? 0 : 2
  const payloadLength = lengthByteCount === 0 ? jsonByteLength : 126
  const buffer = Buffer.alloc(2 + lengthByteCount + jsonByteLength)
  // Write out the first byte, using opcode `1` to indicate that the message
  // payload contains text data
  buffer.writeUInt8(0b10000001, 0)
  buffer.writeUInt8(payloadLength, 1)
  // Write the length of the JSON payload to the second byte
  let payloadOffset = 2
  if (lengthByteCount > 0) {
    buffer.writeUInt16BE(jsonByteLength, 2)
    payloadOffset += lengthByteCount
  } // Write the JSON data to the data buffer
  buffer.write(json, payloadOffset)
  return buffer
}

/* documentary types/index.xml */
/**
 * @typedef {Object} Config Options for the program.
 * @prop {boolean} [log=true] Whether to log on connect and disconnect. Default `true`.
 * @prop {(clientID: string) => void} [onMessage] The callback when a message is received from a client.
 * @prop {(clientID: string, message: string) => void} [onConnect] The callback when a client is connected.
 */
