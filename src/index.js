import { b } from 'erte'
import { constructReply, parseMessage, generateAcceptValue } from './lib'

/**
 * @type {}
 */
function websocket(server, config = {}) {
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

export default websocket

/* documentary types/index.xml */
/**
 * @typedef {Object} Config Options for the program.
 * @prop {boolean} [log=true] Whether to log on connect and disconnect. Default `true`.
 * @prop {(clientID: string, message: string) => void} [onMessage] The callback when a message is received from a client.
 * @prop {(clientID: string) => void} [onConnect] The callback when a client is connected.
 */
