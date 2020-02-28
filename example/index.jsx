/* yarn example/ */
import core, { render } from '@idio/idio'
import websocket from '../src'

(async () => {
  const { url, server } = await core({
    static: {
      use: true,
      root: 'example/frontend',
    },
    index(ctx) {
      ctx.body = render(
        <html>
          <head>
            <title>Websocket Example</title>
          </head>
          <body>
            <h1>
              Hello World.
            </h1>
            Server says: <span id="WSstatus" />
            <script type="module" src="index.js"/>
          </body>
        </html>
        , { addDoctype: true })
    },
  })
  const clients = websocket(server, {
    onConnect(clientId) {
      clients[clientId]('handshake', 'welcome')
    },
    onMessage(clientId, message) {
      console.log('Client %s says: %s', clientId, message)
    },
  })
  console.log(url)
})()