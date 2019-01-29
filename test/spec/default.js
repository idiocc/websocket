import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import websocket from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof websocket, 'function')
  },
  async 'calls package without error'() {
    await websocket()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await websocket({
      text: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T