import { userContext } from '../context';
import { getContexts } from '../store';
import { WebSocket } from 'ws';

export class Bridge {
  constructor(private readonly socket: WebSocket) {
    socket.on('message', (data) => this.listen((data as Buffer).toString()));
  }

  updateElement(html: string, targetId: string): void {
    this.send('updateElement', html, targetId);
  }

  private send(event: string, ...args: unknown[]): void {
    this.socket.send(JSON.stringify([event, ...args]));
  }

  private onEvent(id: string, key: string): void {
    const { rContext, uContext } = getContexts(this.socket);
    const fn: (() => void) | undefined = rContext.events.get(id + key);
    if (fn == null) {
      throw new Error('Unable to find event handler');
    }
    userContext.run(uContext, fn);
  }

  private listen(data: string): void {
    const [type, ...payload] = JSON.parse(data);
    switch (type) {
      case 'onEvent':
        this.onEvent(payload[0], payload[1]);
        break;
    }
  }
}
