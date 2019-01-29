/* yarn example/ */
import websocket from '../src'

(async () => {
  const res = await websocket({
    text: 'example',
  })
  console.log(res)
})()