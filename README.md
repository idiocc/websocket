# @idio/websocket

[![npm version](https://badge.fury.io/js/%40idio%2Fwebsocket.svg)](https://npmjs.org/package/@idio/websocket)

`@idio/websocket` Establishes WebSocket Connection Between Client And Server.

```sh
yarn add -E @idio/websocket
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`websocket(server: Server, config?: Config): ClientList`](#websocketserver-serverconfig-config-clientlist)
  * [`Config`](#type-config)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import websocket from '@idio/websocket'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `websocket(`<br/>&nbsp;&nbsp;`server: Server,`<br/>&nbsp;&nbsp;`config?: Config,`<br/>`): ClientList`

The `websocket` method will setup the listener for the `UPGRADE` event on the server, and store all connected clients in the client list. When clients disconnect, they are removed from that list. The list is a hash object where each key is the accept key sent by the client, and values are the callback functions to send messages to those clients.

__<a name="type-config">`Config`</a>__: Options for the program.

|   Name    |                       Type                       |                      Description                       | Default |
| --------- | ------------------------------------------------ | ------------------------------------------------------ | ------- |
| log       | _boolean_                                        | Whether to log on connect and disconnect.              | `true`  |
| onMessage | _(clientID: string, message: string) =&gt; void_ | The callback when a message is received from a client. | -       |
| onConnect | _(clientID: string) =&gt; void_                  | The callback when a client is connected.               | -       |

_With the following client-side implementation:_

```js
/* eslint-env browser */
const ws = new WebSocket(`ws://${location.host}`, 'json')
setInterval(() => {
  if (ws.readyState == ws.OPEN) ws.send('')
}, 2000)

ws.addEventListener('message', async event => {
  const { message, event: e } = JSON.parse(event.data)
  console.log('Received %s:', e, message)
  ws.send(navigator.userAgent)
})
```

_the server can be setup to listen for connections._

```jsx
/* yarn example/ */
import websocket from '@idio/websocket'
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
```

```fs
http://localhost:5000
Client connected.
Client FIM/Jvt9Ldb1J0HCx5ye8g== says:
  Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0)
  AppleWebKit/537.36 (KHTML, like Gecko)
  Chrome/71.0.3578.98 Safari/537.36
Client disconnected.
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Copyright

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco" />
      </a>
    </th>
    <th>
      © <a href="https://artd.eco">Art Deco</a> for <a href="https://idio.cc">Idio</a>
      2019
    </th><th>
        <a href="https://idio.cc">
          <img src="https://avatars3.githubusercontent.com/u/40834161?s=100" width="100" alt="Idio" />
        </a>
      </th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif" alt="Tech Nation Visa" />
      </a>
    </th>
    <th>
      <a href="https://www.technation.sucks">Tech Nation Visa Sucks</a>
    </th>
  </tr>
</table>


<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>