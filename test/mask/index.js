import { makeTestSuite } from 'zoroaster'
import Context from '../context'
import websocket from '../../src'

const ts = makeTestSuite('test/result', {
  async getResults(input) {
    const res = await websocket({
      text: input,
    })
    return res
  },
  context: Context,
})

// export default ts
