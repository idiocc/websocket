import { b } from 'erte'
import { constructReply, parseMessage, generateAcceptValue } from './lib'

/**
 * @type {_idio.websocket}
 */
function websocket(server, config = {}) {
  const {
    // eslint-disable-next-line no-unused-vars
    onMessage = (cid, m) => {},
    // eslint-disable-next-line no-unused-vars
    onConnect = (cid) => {},
    log = true,
  } = config
  const clients = {}
  /**
   * @param {!http.IncomingMessage} req
   * @param {!net.Socket} socket
   */
  function listener(req, socket) {
    /**
     * @suppress {checkTypes}
     */
    const UPGRADE = req.headers['upgrade']
    if (UPGRADE != 'websocket') {
      socket.end('HTTP/1.1 400 Bad Request')
      return
    }
    /**
     * @suppress {checkTypes}
     */
    const PROTO = req.headers['sec-websocket-protocol']
    /**
     * @suppress {checkTypes}
     */
    const KEY = req.headers['sec-websocket-key']
    const hash = generateAcceptValue(KEY)
    const responseHeaders = [
      'HTTP/1.1 101 Web Socket Protocol Handshake',
      'Upgrade: WebSocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${hash}`,
    ]
    // Read the subprotocol from the client request headers:
    const protocols = !PROTO ? [] : PROTO.split(',').map(s => s.trim())
    if (protocols.includes('json')) {
      responseHeaders.push('Sec-WebSocket-Protocol: json')
    }
    socket.write(responseHeaders.join('\r\n') + '\r\n\r\n')
    log && console.log(b('Client connected.', 'green'))
    socket.on('data', buffer => {
      const message = parseMessage(buffer)
      if (message) {
        onMessage(KEY, message)
      } else if (message === null) {
        delete clients[KEY]
        log && console.log(b('Client disconnected.', 'red'))
      }
    })
    /**
     * @type {_idio.sendMessage}
     */
    const sendMessage = (event, message) => {
      socket.write(constructReply({ event, message }))
    }
    clients[KEY] = sendMessage
    onConnect(KEY)
  }
  server.on('upgrade', listener)
  return clients
}

export default websocket

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').websocket} _idio.websocket
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').sendMessage} _idio.sendMessage
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('net').Socket} net.Socket
 */