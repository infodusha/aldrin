import { renderContext } from '../context';

type MountFn = (() => void) | (() => () => void);

export function useMount(fn: MountFn): void {
  const context = renderContext.get();
  context.mount.add(fn);
}

export class Mount {
  private readonly mounts = new Set<MountFn>();
  private readonly unMounts = new Set<() => void>();

  add(fn: MountFn): void {
    this.mounts.add(fn);
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
  }
}
