import { getReactiveChange, isReactive, makeReactive } from './reactive';
import { stateCallsDetector } from '../hooks/state';
import { SingleEventEmitter } from './single-event-emitter';

export function makeComputed<T>(fn: () => T): () => T {
  if (isReactive(fn)) {
    return fn;
  }

  function getValue(): T {
    const { result, calls } = stateCallsDetector.detect(fn);
    if (calls.length === 0) {
      console.warn(`No states for computed ${fn.toString()}`);
    }

    const changes = calls.map((reactive) => getReactiveChange(reactive));
    SingleEventEmitter.mergeOnce(handleChange, changes);

    return result;
  }

  const change = makeReactive(getValue);

  function handleChange(): void {
    const value = getValue();
    change.emit(value);
  }

  return getValue;
}
