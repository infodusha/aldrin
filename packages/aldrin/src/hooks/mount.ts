import { renderContext, UserContext, userContext } from '../context';

type MountFn = (() => void) | (() => () => void);

export function useMount(fn: MountFn): void {
  const context = renderContext.get();
  context.mount.add(fn);
}

export class Mount {
  private readonly mounts = new Set<MountFn>();
  private readonly unMounts = new WeakMap<UserContext, Set<() => void>>();

  add(fn: MountFn): void {
    this.mounts.add(fn);
  }

  mount(): void {
    const uContext = userContext.get();
    this.mounts.forEach((fn) => {
      const unMount = fn();
      if (unMount != null) {
        let unMounts = this.unMounts.get(uContext);
        if (unMounts == null) {
          unMounts = new Set<() => void>();
          this.unMounts.set(uContext, unMounts);
        }
        unMounts.add(unMount);
      }
    });
  }

  unMount(): void {
    const uContext = userContext.get();
    const unMounts = this.unMounts.get(uContext);
    if (unMounts == null) {
      return;
    }
    unMounts.forEach((fn) => fn());
    unMounts.clear();
  }
}
