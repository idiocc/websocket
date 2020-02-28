const { _websocket } = require('./websocket')

/**
 * Sets up a listener for the `UPGRADE` event on the server, and stores all connected clients in the client list. When clients disconnect, they are removed from this list. The list is a hash object where each key is the _accept key_ sent by the client, and values are the callback functions to send messages to those clients.
 * @param {!http.Server} server The server on which to setup the listener.
 * @param {!_idio.WebSocketConfig} [config] Options for the web socket protocol communication.
 * @param {boolean} [config.log=true] Whether to log on connect and disconnect. Default `true`.
 * @param {(clientID: string, message: string) => void} [config.onMessage] The callback when a message is received from a client.
 * @param {(clientID: string) => void} [config.onConnect] The callback when a client is connected.
 * @return {!Object<string, _idio.sendMessage>}
 */
function websocket(server, config) {
  return _websocket(server, config)
}

module.exports = websocket

/* typal types/index.xml namespace */
/**
 * @typedef {_idio.WebSocketConfig} WebSocketConfig Options for the web socket protocol communication.
 * @typedef {Object} _idio.WebSocketConfig Options for the web socket protocol communication.
 * @prop {boolean} [log=true] Whether to log on connect and disconnect. Default `true`.
 * @prop {(clientID: string, message: string) => void} [onMessage] The callback when a message is received from a client.
 * @prop {(clientID: string) => void} [onConnect] The callback when a client is connected.
 */

/* typal types/api.xml namespace */
/**
 * @typedef {import('http').Server} http.Server
 * @typedef {_idio.websocket} websocket Sets up a listener for the `UPGRADE` event on the server, and stores all connected clients in the client list. When clients disconnect, they are removed from this list. The list is a hash object where each key is the _accept key_ sent by the client, and values are the callback functions to send messages to those clients.
 * @typedef {(server: !http.Server, config?: !_idio.WebSocketConfig) => !Object<string, _idio.sendMessage>} _idio.websocket Sets up a listener for the `UPGRADE` event on the server, and stores all connected clients in the client list. When clients disconnect, they are removed from this list. The list is a hash object where each key is the _accept key_ sent by the client, and values are the callback functions to send messages to those clients.
 * @typedef {_idio.sendMessage} sendMessage
 * @typedef {(event: string, message: *) => void} _idio.sendMessage
 */
