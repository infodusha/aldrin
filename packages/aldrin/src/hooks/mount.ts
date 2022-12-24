import { renderContext } from '../context';

type MountFn = (() => void) | (() => () => void);

export function useMount(fn: MountFn): void {
  const context = renderContext.get();
  context.mount.addMount(fn);
}

export function useCleanup(fn: () => void): void {
  const context = renderContext.get();
  context.mount.addCleanup(fn);
}

export class Mount {
  private readonly mounts = new Set<MountFn>();
  private readonly unMounts = new Set<() => void>();
  private readonly cleanups = new Set<() => void>();

  addMount(fn: MountFn): void {
    this.mounts.add(fn);
  }

  addCleanup(fn: () => void): void {
    this.cleanups.add(fn);
  }

  mount(): void {
    this.mounts.forEach((fn) => {
      const unMount = fn();
      if (unMount != null) {
        this.unMounts.add(unMount);
      }
    });
  }

  unMount(): void {
    this.unMounts.forEach((fn) => fn());
    this.unMounts.clear();
    this.cleanups.forEach((fn) => fn());
  }
}
