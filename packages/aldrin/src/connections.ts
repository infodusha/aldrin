import { WebSocket } from 'ws';
import { IncomingMessage } from 'node:http';
import { getContexts, storeContexts, unStoreRenderContext } from './store';
import { UserContext, userContext } from './context';
import { callMounts, callUnMounts } from './hooks/mount';
import { Bridge } from './bridge';
import cookie from 'cookie';

const connections = new Set<WebSocket>();

export async function broadcast(data: string): Promise<void> {
  for (const socket of connections) {
    await write(socket, data);
  }
}

export async function write(socket: WebSocket, data: string): Promise<void> {
  return await new Promise((resolve, reject) => {
    socket.send(data, (err) => {
      if (err != null) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function connect(socket: WebSocket, uuid: string): void {
  const bridge = new Bridge(socket);
  const uContext = new UserContext(bridge);
  const rContext = unStoreRenderContext(uuid);
  storeContexts(socket, rContext, uContext);
  userContext.run(uContext, () => {
    callMounts(rContext);
  });
}

function disconnect(socket: WebSocket): void {
  connections.delete(socket);
  const { rContext, uContext } = getContexts(socket);
  userContext.run(uContext, () => {
    callUnMounts(rContext);
  });
}

export function handleConnection(socket: WebSocket, req: IncomingMessage): void {
  connections.add(socket);
  const uuid = cookie.parse(req.headers.cookie ?? '').uuid;
  connect(socket, uuid);
  socket.on('close', () => disconnect(socket));
  socket.on('error', (err) => console.error(err));
}
