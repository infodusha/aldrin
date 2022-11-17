import { RenderContext, UserContext } from './context';
import { WebSocket } from 'ws';

const socketToRenderContext = new WeakMap<WebSocket, RenderContext>();
const socketToUserContext = new WeakMap<WebSocket, UserContext>();

const renderContexts = new Set<RenderContext>();

export function storeRenderContext(context: RenderContext): void {
  renderContexts.add(context);
}

export function removeRenderContext(context: RenderContext): void {
  renderContexts.delete(context);
}

export function unStoreRenderContext(uuid: string): RenderContext {
  const context = [...renderContexts].find((c) => c.uuid === uuid);
  if (context === undefined) {
    throw new Error('Unable to find context');
  }
  return context;
}

export function storeContexts(
  socket: WebSocket,
  rContext: RenderContext,
  uContext: UserContext
): void {
  socketToRenderContext.set(socket, rContext);
  socketToUserContext.set(socket, uContext);
}

export function getContexts(socket: WebSocket): { rContext: RenderContext; uContext: UserContext } {
  const rContext = socketToRenderContext.get(socket);
  const uContext = socketToUserContext.get(socket);
  if (rContext == null) {
    throw new Error('Unable to find render context');
  }
  if (uContext == null) {
    throw new Error('Unable to find user context');
  }
  return { rContext, uContext };
}
