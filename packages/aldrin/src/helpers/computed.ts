import {
  bindReactiveToRenderer,
  isReactive,
  makeReactive,
  processReactiveRenderers,
} from './reactive';
import { stateReads } from '../hooks/state';

export function makeComputed<T>(fn: () => T): () => T {
  if (isReactive(fn)) {
    return fn;
  }

  const reactiveFn = makeReactive<T>(() => {
    stateReads.clear();
    const result = fn();
    if (stateReads.size === 0) {
      console.warn('No states for computed');
    }
    stateReads.forEach((state) => {
      processReactiveRenderers(reactiveFn, (renderer) => {
        bindReactiveToRenderer(state as JSX.FunctionElement, renderer);
      });
    });
    stateReads.clear();
    return result;
  });

  return reactiveFn;
}
