import { WebSocket } from 'ws';
import { IncomingMessage } from 'node:http';
import { removeRenderContext, getRenderContext } from './store';
import { RenderContext, UserContext, userContext } from './context';
import { Bridge } from './helpers/bridge';
import cookie from 'cookie';

export class Connection {
  public readonly uContext: UserContext;
  private initialized = false;

  constructor(public readonly socket: WebSocket, public readonly rContext: RenderContext) {
    const bridge = new Bridge(this);
    this.uContext = new UserContext(bridge);
  }

  static fromSocket(socket: WebSocket, req: IncomingMessage): Connection {
    const uuid = cookie.parse(req.headers.cookie ?? '').uuid;
    const rContext = getRenderContext(uuid);
    return new Connection(socket, rContext);
  }

  init(): void {
    if (this.initialized) {
      throw new Error('Connection already initialized');
    }
    this.initialized = true;
    this.connect();
    this.socket.on('close', () => this.disconnect());
    this.socket.on('error', (err) => console.error(err));
  }

  private connect(): void {
    removeRenderContext(this.rContext);
    userContext.run(this.uContext, () => {
      this.rContext.mount.mount();
    });
  }

  private disconnect(): void {
    userContext.run(this.uContext, () => {
      this.rContext.mount.unMount();
    });
  }
}
