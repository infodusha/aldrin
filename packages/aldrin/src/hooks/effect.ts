import { useMount } from './mount';
import { makeComputed } from '../helpers/computed';

type EffectFn = (() => void) | (() => () => void);

export function useEffect(fn: EffectFn): void {
  useMount(() => {
    const { initial, change$ } = makeComputed<ReturnType<EffectFn>>(fn);
    let cleanup: ReturnType<EffectFn> = initial;

    function callCleanup(): void {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    }

    const subscription = change$.subscribe((newCleanup) => {
      callCleanup();
      cleanup = newCleanup;
    });

    return () => {
      subscription.unsubscribe();
      callCleanup();
    };
  });
}
