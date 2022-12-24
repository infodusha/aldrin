import { merge, Observable, startWith, switchMap, take } from 'rxjs';
import { getReactiveChange, isReactive } from './reactive';
import { stateCallsDetector } from '../hooks/state';
import { useCleanup } from '../hooks/mount';

export interface Computed<T> {
  initial: T;
  change$: Observable<T>;
}

export function makeComputed<T>(fn: () => T): Computed<T> {
  if (isReactive(fn)) {
    return {
      initial: fn(),
      change$: getReactiveChange(fn),
    };
  }

  function getComputed(): Computed<T> {
    const { result: initial, calls } = stateCallsDetector.detect(fn);
    const changes = calls.map((reactive) => getReactiveChange<unknown>(reactive));
    return {
      initial,
      change$: merge(...changes).pipe(
        take(1),
        switchMap(() => {
          const computed = getComputed();
          return computed.change$.pipe(startWith(computed.initial));
        })
      ),
    };
  }

  return getComputed();
}

export function setComputedListener<T>(fn: () => T, onChange: (value: T) => void): T {
  const { initial, change$ } = makeComputed<T>(fn);
  const subscription = change$.subscribe(onChange);
  useCleanup(() => subscription.unsubscribe());
  return initial;
}
