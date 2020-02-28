import { createHash } from 'crypto'

// copyright https://medium.com/hackernoon/implementing-a-websocket-server-with-node-js-d9b78ec5ffa8

export function constructReply(data) {
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

export function parseMessage(buffer) {
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

/**
 * Creates an accept value for websocket.
 * @param {string} key The client key.
 */
export function generateAcceptValue(key) {
  return createHash('sha1')
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`, 'binary')
    .digest('base64')
}