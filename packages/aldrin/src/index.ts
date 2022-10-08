import { render } from './render';
import { RenderContext, renderContext } from './context';
import { WebSocketServer } from 'ws';
import { handleConnection } from './connections';
import * as http from 'node:http';
import cookie from 'cookie';
import { storeRenderContext } from './store';
import { config } from './config';

interface PreRender {
  html: string;
  context: RenderContext;
}

export function preRender(component: () => JSX.Element): PreRender {
  const context = new RenderContext();
  const html = renderContext.run(context, () => {
    return render(component());
  });
  storeRenderContext(context);
  return { html, context };
}

export function serve(preRender: PreRender, res: http.ServerResponse<http.IncomingMessage>): void {
  const uuid = preRender.context.uuid;
  const cookies = cookie.serialize('uuid', uuid, { httpOnly: true });
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Set-Cookie': cookies,
  });
  res.end(preRender.html);
}

export function serveWebSocket(): void {
  const port = config.port;
  const wss = new WebSocketServer({ port });
  wss.on('connection', handleConnection);
}

export { useMount } from './hooks/mount';
export { useState } from './hooks/state';
export { Connection } from './components/connection';
export { Show } from './components/show';
