import { makeReactive } from '../helpers/reactive';
import { CallsDetector } from '../helpers/calls-detector';

export const stateCallsDetector = new CallsDetector<() => unknown>();

export type State<T> = [() => T, (value: T) => void];

/*
  Creates a tuple `[get, set]`, bound to user

  Changes will trigger rerender
*/
export function useState<T>(initialValue: T): State<T> {
  let value = initialValue;

  function get(): T {
    stateCallsDetector.call(get);
    return value;
  }

  const change = makeReactive<T>(get);

  function set(newValue: T): void {
    value = newValue;
    change.next(newValue);
  }

  return [get, set];
}
