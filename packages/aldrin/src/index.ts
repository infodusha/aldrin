import * as http from 'node:http';
import crypto from 'node:crypto';
import cookie from 'cookie';

import { render } from './render';
import { RenderContext, renderContext } from './context';
import { WebSocketServer } from 'ws';
import { Connection } from './connection';
import { removeRenderContext, storeRenderContext } from './store';
import { config } from './config';
import { setConnectionStr } from './components/connection';

function serve(html: string, uuid: string, res: http.ServerResponse<http.IncomingMessage>): void {
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
  const uuid = crypto.randomUUID();
  storeRenderContext(uuid, context);
  serve(html, uuid, res);
  setTimeout(() => {
    removeRenderContext(context);
  }, config.connectionTimeoutMs);
}

export async function bootstrap(): Promise<void> {
  const port = config.port;
  const wss = new WebSocketServer({ port });
  wss.on('connection', (socket, req) => {
    const connection = Connection.fromSocket(socket, req);
    connection.init();
  });
  await new Promise<void>((resolve, reject) => {
    wss.on('listening', resolve);
    wss.on('error', reject);
  });
  await setConnectionStr();
}

function throwIfNoBody(context: RenderContext): void {
  if (!context.hasBody) {
    throw new Error('Root component has no body tag');
  }
}

export { useMount } from './hooks/mount';
export { useState } from './hooks/state';
export { useEffect } from './hooks/effect';
export { useAsync } from './hooks/async';
export { useSharedState, createSharedState } from './hooks/shared-state';
export { Show } from './components/show';
export { unsafe } from './render/';
