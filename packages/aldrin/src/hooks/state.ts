import { makeReactive } from '../helpers/reactive';
import { CallsDetector } from '../helpers/calls-detector';

export const stateCallsDetector = new CallsDetector<() => any>();

/*
  Creates a tuple `[get, set]`, bound to user

  Changes will trigger rerender
*/
export function useState<T>(initialValue: T): [() => T, (value: T) => void] {
  let value = initialValue;

  function get(): T {
    stateCallsDetector.call(get);
    return value;
  }

  const change = makeReactive<T>(get);

  function set(newValue: T): void {
    value = newValue;
    change.emit(newValue);
  }

  return [get, set];
}
