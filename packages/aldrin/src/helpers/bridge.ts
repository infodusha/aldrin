import { userContext } from '../context';
import { Connection } from '../connection';

export class Bridge {
  constructor(private readonly connection: Connection) {
    connection.socket.on('message', (data) => this.listen((data as Buffer).toString()));
  }

  updateElement(html: string, parentId: string, nodeIndex: number, nodeCount: number): void {
    this.send('updateElement', html, parentId, nodeIndex, nodeCount);
  }

  createElement(html: string, parentId: string, nodeIndex: number): void {
    this.send('createElement', html, parentId, nodeIndex);
  }

  removeElement(parentId: string, nodeIndex: number, nodeCount: number): void {
    this.send('removeElement', parentId, nodeIndex, nodeCount);
  }

  patchProp(targetId: string, key: string, value: string): void {
    this.send('patchProp', targetId, key, value);
  }

  private send(event: string, ...args: unknown[]): void {
    this.connection.socket.send(JSON.stringify([event, ...args]));
  }

  private onEvent(id: string, key: string): void {
    const fn: (() => void) | undefined = this.connection.rContext.events.get(id + key);
    if (fn == null) {
      throw new Error('Unable to find event handler');
    }
    userContext.run(this.connection.uContext, fn);
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
