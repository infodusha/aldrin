import { render } from './render';
import { RenderContext, renderContext } from './context';
import { WebSocketServer } from 'ws';
import { handleConnection } from './connections';
import * as http from 'node:http';
import cookie from 'cookie';
import { removeRenderContext, storeRenderContext } from './store';
import { config } from './config';

function serve(
  html: string,
  context: RenderContext,
  res: http.ServerResponse<http.IncomingMessage>
): void {
  const uuid = context.uuid;
  const cookies = cookie.serialize('uuid', uuid, { httpOnly: true });
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Set-Cookie': cookies,
  });
  res.end(html);
}

export async function renderPage(
  component: () => JSX.Element,
  res: http.ServerResponse<http.IncomingMessage>
): Promise<void> {
  const context = new RenderContext();
  const html = await renderContext.run(context, () => {
    return render(component());
  });
  throwIfNoBody(context);
  storeRenderContext(context);
  serve(html, context, res);
  setTimeout(() => {
    removeRenderContext(context);
  }, config.connectionTimeoutMs);
}

export function serveWebSocket(): void {
  const port = config.port;
  const wss = new WebSocketServer({ port });
  wss.on('connection', handleConnection);
}

function throwIfNoBody(context: RenderContext): void {
  if (!context.hasBody) {
    throw new Error('Root component has no body tag');
  }
}

export { useMount } from './hooks/mount';
export { useState } from './hooks/state';
export { useWatch } from './hooks/watch';
export { useEffect } from './hooks/effect';
export { Show } from './components/show';
