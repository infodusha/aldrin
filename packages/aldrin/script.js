const protocol = location.protocol.includes('https') ? 'wss' : 'ws';
const socket = new WebSocket(`${protocol}://${location.hostname}:${port}`);

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
    case 'patchProp':
      patchProp(...args);
      break;
  }
});

function createElements(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.childNodes;
}

function updateElement(html, parentId, nodeIndex, nodeCount) {
  removeElement(parentId, nodeIndex, nodeCount);
  createElement(html, parentId, nodeIndex);
}

function getChildren(parentId) {
  const parent = document.getElementById(parentId);
  return Array.from(parent.childNodes).filter((c) => c.nodeType !== 8); // Filter out comments
}

function createElement(html, parentId, nodeIndex) {
  const elements = createElements(html);
  const children = getChildren(parentId);
  if (nodeIndex === children.length) {
    const parent = document.getElementById(parentId);
    parent.append(...elements);
  } else {
    children[nodeIndex].before(...elements);
  }
}

function removeElement(parentId, nodeIndex, nodeCount) {
  getChildren(parentId)
    .slice(nodeIndex, nodeIndex + nodeCount)
    .forEach((child) => child.remove());
}

function patchProp(targetId, key, value) {
  const parent = document.getElementById(targetId);
  parent.setAttribute(key, value);
}

function onEvent(key, item) {
  socket.send(JSON.stringify(['onEvent', item.id, key]));
}

window.onEvent = onEvent;
