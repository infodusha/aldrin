import { userContext } from '../context';

export type State<T> = [() => T, (value: T) => void];

export function useState<T>(initialValue: T): State<T> {
  const state: State<T> = [get, set];

  function get(): T {
    if (!userContext.has()) {
      return initialValue;
    }
    const context = userContext.get();
    return context.states.get(state);
  }

  function set(value: T): void {
    const context = userContext.get();
    context.states.set(state, value);
  }

  return state;
}
