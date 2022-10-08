import crypto from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import { MountFn } from './hooks/mount';
import { State } from './hooks/state';
import { Bridge } from './bridge';

export class RenderContext {
  uuid = crypto.randomUUID();
  mounts = new Set<MountFn>();
  unMounts = new WeakMap<UserContext, Set<() => void>>();
  events = new Map<string, (...args: unknown[]) => void>();
}

export class UserContext {
  states = new WeakMap<State<any>, any>();

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
