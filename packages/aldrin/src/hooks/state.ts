import { useRef } from './ref';
import { makeReactive } from '../helpers/reactive';
import { CallsDetector } from '../helpers/calls-detector';

export const stateCallsDetector = new CallsDetector<() => any>();

/*
  Creates a tuple `[get, set]`, bound to user

  Changes will trigger rerender
*/
export function useState<T>(initialValue: T): [() => T, (value: T) => void] {
  const ref = useRef<T>(initialValue, false);

  function get(): T {
    stateCallsDetector.call(get);
    return ref.value;
  }

  const change = makeReactive<T>(get);

  function set(value: T): void {
    ref.value = value;
    change.emit(value);
  }

  return [get, set];
}
