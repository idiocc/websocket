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