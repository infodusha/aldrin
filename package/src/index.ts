import { render } from './render';
import { RenderContext, renderContext } from './context';
import { WebSocketServer } from 'ws';
import { handleConnection } from './connections';
import * as http from 'node:http';
import cookie from 'cookie';
import { removeRenderContext, storeRenderContext } from './store';
import { config } from './config';

export interface PreRender {
  html: string;
  context: RenderContext;
}

export function preRender(component: () => JSX.Element): PreRender {
  const context = new RenderContext();
  const html = renderContext.run(context, () => {
    return render(component());
  });
  throwIfNoBody(context);
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

export function renderAndServe(
  component: () => JSX.Element,
  res: http.ServerResponse<http.IncomingMessage>
): void {
  const context = new RenderContext();
  const html = renderContext.run(context, () => {
    return render(component());
  });
  throwIfNoBody(context);
  storeRenderContext(context);
  serve({ html, context }, res);
  removeRenderContext(context);
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
export { Show } from './components/show';