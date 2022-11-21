import { getReactiveChange, isReactive, makeReactive } from './reactive';
import { stateCallsDetector } from '../hooks/state';

export function makeComputed<T>(fn: () => T): () => T {
  if (isReactive(fn)) {
    return fn;
  }

  let lastCalls: Set<() => T>;

  function clear(): void {
    lastCalls.forEach((reactive) => {
      const change = getReactiveChange(reactive);
      change.removeListener(handleChange);
    });
    lastCalls.clear();
  }

  function getValue(): T {
    const { result, calls } = stateCallsDetector.detect(fn);
    if (calls.size === 0) {
      console.warn(`No states for computed ${fn.toString()}`);
    }

    lastCalls = new Set(calls);

    calls.forEach((reactive) => {
      const change = getReactiveChange(reactive);
      change.once(handleChange);
    });

    return result;
  }

  const change = makeReactive(getValue);

  function handleChange(): void {
    clear();
    queueMicrotask(() => {
      const value = getValue();
      change.emit(value);
    });
  }

  return getValue;
}
