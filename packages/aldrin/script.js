const socket = new WebSocket(`ws://localhost:${port}`);

socket.addEventListener('message', ({ data }) => {
  const [event, ...args] = JSON.parse(data);
  switch (event) {
    case 'updateElement':
      updateElement(...args);
      break;
    case 'createElement':
      createElement(...args);
      break;
    case 'removeElement':
      removeElement(...args);
      break;
  }
});

function updateElement(html, targetId) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const target = document.getElementById(targetId);
  target.replaceWith(...div.children);
}

function createElement(html, parentId, nodeIndex) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const parent = document.getElementById(parentId);
  const children = parent.children;
  if (nodeIndex === children.length) {
    parent.append(...div.children);
  } else {
    children[nodeIndex].before(...div.children);
  }
}

function removeElement(parentId, nodeIndex, nodeCount) {
  const parent = document.getElementById(parentId);
  Array.from(parent.children)
    .slice(nodeIndex, nodeIndex + nodeCount)
    .forEach((child) => child.remove());
}

function onEvent(key, item) {
  socket.send(JSON.stringify(['onEvent', item.id, key]));
}
