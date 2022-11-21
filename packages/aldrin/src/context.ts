import crypto from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Mount } from './hooks/mount';
import { Bridge } from './helpers/bridge';
import { Ref } from './hooks/ref';

export class RenderContext {
  readonly uuid = crypto.randomUUID();
  readonly mount = new Mount();
  readonly events = new Map<string, (...args: unknown[]) => void>();
  hasBody = false;
}

export class UserContext {
  readonly refs = new WeakMap<Ref<any>, any>();

  constructor(public readonly bridge: Bridge) {}
}

class Context<T> {
  private readonly value = new AsyncLocalStorage<T>();

  has(): boolean {
    const store = this.value.getStore();
    return store !== undefined;
  }

  get(): T {
    const store = this.value.getStore();
    if (store === undefined) {
      throw new Error('Unable to get context');
    }
    return store;
  }

  run<R>(context: T, fn: () => R): R {
    return this.value.run(context, fn);
  }
}

export const renderContext = new Context<RenderContext>();
export const userContext = new Context<UserContext>();
