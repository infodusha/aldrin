import { RenderContext, renderContext, userContext } from '../context';

export type MountFn = (() => void) | (() => () => void);

export function useMount(fn: MountFn): void {
  const context = renderContext.get();
  context.mounts.add(fn);
}

export function callMounts(rContext: RenderContext): void {
  const uContext = userContext.get();
  rContext.mounts.forEach((fn) => {
    const unMount = fn();
    if (unMount != null) {
      let unMounts = rContext.unMounts.get(uContext);
      if (unMounts == null) {
        unMounts = new Set<() => void>();
        rContext.unMounts.set(uContext, unMounts);
      }
      unMounts.add(unMount);
    }
  });
}

export function callUnMounts(rContext: RenderContext): void {
  const uContext = userContext.get();
  const unMounts = rContext.unMounts.get(uContext);
  if (unMounts == null) {
    return;
  }
  unMounts.forEach((fn) => fn());
  unMounts.clear();
}
