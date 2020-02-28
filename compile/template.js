const { _websocket } = require('./websocket')

/**
 * @methodType {_idio.websocket}
 */
function websocket(server, config) {
  return _websocket(server, config)
}

module.exports = websocket

/* typal types/index.xml namespace */

/* typal types/api.xml namespace */
