import {
  bindReactiveToRenderer,
  isReactive,
  makeReactive,
  processReactiveRenderers,
} from './reactive';
import { AnyFunction } from '../types';

const readStates = new Set<AnyFunction>();

export function makeComputed<T>(fn: () => T): () => T {
  if (isReactive(fn)) {
    return fn;
  }

  const reactiveFn = makeReactive<T>(() => {
    readStates.clear();
    const result = fn();
    if (readStates.size === 0) {
      console.warn('No states for computed');
    }
    readStates.forEach((state) => {
      processReactiveRenderers(reactiveFn, (renderer) => {
        bindReactiveToRenderer(state as JSX.FunctionElement, renderer);
      });
    });
    readStates.clear();
    return result;
  });

  return reactiveFn;
}

export function readState(fn: AnyFunction): void {
  readStates.add(fn);
}
