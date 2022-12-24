import { useMount } from './mount';
import { makeComputed } from '../helpers/computed';

type EffectFn = (() => void) | (() => () => void);

export function useEffect(fn: EffectFn): void {
  useMount(() => {
    const { initial, change$ } = makeComputed<ReturnType<EffectFn>>(fn);
    let cleanup: ReturnType<EffectFn> = initial;

    const subscription = change$.subscribe((newCleanup) => {
      cleanup = newCleanup;
    });

    return () => {
      subscription.unsubscribe();
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  });
}
