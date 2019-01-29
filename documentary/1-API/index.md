## API

The package is available by importing its default function:

```js
import websocket from '@idio/websocket'
```

%~%

```## websocket => ClientList
[
  ["server", "Server"],
  ["config?", "Config"]
]
```

The `websocket` method will setup the listener for the `UPGRADE` event on the server, and store all connected clients in the client list. When clients disconnect, they are removed from that list. The list is a hash object where each key is the accept key sent by the client, and values are the callback functions to send messages to those clients.

%TYPEDEF types/index.xml%

%EXAMPLE: example/example.jsx, ../src => @idio/websocket%

```fs
http://localhost:5000
Client connected.
Client FIM/Jvt9Ldb1J0HCx5ye8g== says:
  Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0)
  AppleWebKit/537.36 (KHTML, like Gecko)
  Chrome/71.0.3578.98 Safari/537.36
Client disconnected.
```

%~%