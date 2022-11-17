const socket = new WebSocket(`ws://localhost:${port}`);

socket.addEventListener('message', ({ data }) => {
  const [event, ...args] = JSON.parse(data);
  switch (event) {
    case 'updateElement':
      updateElement(...args);
      break;
  }
});

function updateElement(html, targetId) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const target = document.getElementById(targetId);
  target.replaceWith(...div.children);
}

function onEvent(key, item) {
  socket.send(JSON.stringify(['onEvent', item.id, key]));
}
