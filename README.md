# @idio/websocket

[![npm version](https://badge.fury.io/js/%40idio%2Fwebsocket.svg)](https://www.npmjs.com/package/@idio/websocket)

`@idio/websocket` Establishes _WebSocket_ Connections Between Clients And The Server.

```sh
yarn add @idio/websocket
npm i @idio/websocket
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`websocket(server, config=): !Object<string, sendMessage>`](#websocketserver-httpserverconfig-websocketconfig-objectstring-sendmessage)
  * [`WebSocketConfig`](#type-websocketconfig)
- [`sendMessage(event, message): void`](#sendmessageevent-stringmessage--void)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default function:

```js
import websocket from '@idio/websocket'
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## <code><ins>websocket</ins>(</code><sub><br/>&nbsp;&nbsp;`server: !http.Server,`<br/>&nbsp;&nbsp;`config=: !WebSocketConfig,`<br/></sub><code>): <i>!Object<string, sendMessage></i></code>
Sets up a listener for the `UPGRADE` event on the server, and stores all connected clients in the client list. When clients disconnect, they are removed from this list. The list is a hash object where each key is the _accept key_ sent by the client, and values are the callback functions to send messages to those clients.

 - <kbd><strong>server*</strong></kbd> <em><code><a href="https://nodejs.org/api/http.html#http_class_http_server" title="An HTTP server that extends net.Server to handle network requests."><img src=".documentary/type-icons/node.png" alt="Node.JS Docs">!http.Server</a></code></em>: The server on which to setup the listener.
 - <kbd>config</kbd> <em><code><a href="#type-websocketconfig" title="Options for the web socket protocol communication.">!WebSocketConfig</a></code></em> (optional): Additional configuration.

__<a name="type-websocketconfig">`WebSocketConfig`</a>__: Options for the web socket protocol communication.


|   Name    |                         Type                         |                      Description                       | Default |
| --------- | ---------------------------------------------------- | ------------------------------------------------------ | ------- |
| log       | <em>boolean</em>                                     | Whether to log on connect and disconnect.              | `true`  |
| onMessage | <em>(clientID: string, message: string) => void</em> | The callback when a message is received from a client. | -       |
| onConnect | <em>(clientID: string) => void</em>                  | The callback when a client is connected.               | -       |

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
  window.WSstatus.innerText = message
  ws.send(navigator.userAgent)
})
```

_the server can be setup to listen for connections._

```jsx
/* yarn example/ */
import core, { render } from '@idio/idio'
import websocket from '@idio/websocket'

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

## <code><ins>sendMessage</ins>(</code><sub><br/>&nbsp;&nbsp;`event: string,`<br/>&nbsp;&nbsp;`message: *,`<br/></sub><code>): <i>void</i></code>
 - <kbd><strong>event*</strong></kbd> <em>`string`</em>: The name of the event to send.
 - <kbd><strong>message*</strong></kbd> <em>`*`</em>: The data, that will be serialised in _JSON_.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

## Copyright

<table>
  <tr>
    <th>
      <a href="https://www.artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://www.artd.eco">Art Deco™</a> for <a href="https://idio.cc">Idio</a> 2020</th>
    <th>
      <a href="https://idio.cc">
        <img src="https://avatars3.githubusercontent.com/u/40834161?s=100" width="100" alt="Idio">
      </a>
    </th>
  </tr>
</table>

WebSocket Node.JS implementation by **Srushtika Neelakantam** from [Implementing a WebSocket server with Node.js](https://hackernoon.com/implementing-a-websocket-server-with-node-js-d9b78ec5ffa8)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>