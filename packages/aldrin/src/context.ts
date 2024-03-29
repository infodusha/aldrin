import { AsyncLocalStorage } from 'node:async_hooks';
import { Mount } from './hooks/mount';
import { Bridge } from './helpers/bridge';
import { TreeItem, TreeNode } from './render';

export class RenderContext {
  readonly mount = new Mount();
  readonly events = new Map<string, () => void>();
  readonly treeNodeToId = new WeakMap<TreeNode, string>();
  hasBody = false;
  treeRoot: TreeItem | undefined;
}

export class UserContext {
  constructor(public readonly bridge: Bridge) {}
}

export class Context<T> {
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
