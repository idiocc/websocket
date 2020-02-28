/**
 * @fileoverview
 * @externs
 */

/* typal types/index.xml externs */
/** @const */
var _idio = {}
/**
 * Options for the web socket protocol communication.
 * @typedef {{ log: (boolean|undefined), onMessage: ((function(string,string): void)|undefined), onConnect: ((function(string): void)|undefined) }}
 */
_idio.WebSocketConfig

/* typal types/api.xml externs */
/**
 * Sets up a listener for the `UPGRADE` event on the server, and stores all connected clients in the client list. When clients disconnect, they are removed from this list. The list is a hash object where each key is the _accept key_ sent by the client, and values are the callback functions to send messages to those clients.
 * @typedef {function(!http.Server,!_idio.WebSocketConfig=): !Object<string, _idio.sendMessage>}
 */
_idio.websocket
/**
 * @typedef {function(string,*)}
 */
_idio.sendMessage
