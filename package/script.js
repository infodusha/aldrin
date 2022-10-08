const socket = new WebSocket(`ws://localhost:${port}`);

socket.addEventListener('message', (event) => {
  console.log('Message from server ', event.data);
});

function onEvent(key, item) {
  socket.send(JSON.stringify(['onEvent', item.id, key]));
}
