/* yarn example/ */
import websocket from '../src'
import core from '@idio/core'
import render from 'preact-render-to-string'

(async () => {
  const { url, server } = await core({
    static: {
      use: true,
      root: 'example/frontend',
    },
    async index(ctx) {
      ctx.body = '<!doctype html>' + render(
        <html>
          <head>
            <title>Websocket Example</title>
          </head>
          <body>
            <script type="module" src="index.js"/>
          </body>
        </html>
      )
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