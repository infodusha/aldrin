import { State, useState } from './state';
import { userContext } from '../context';
import { useMount } from './mount';

export interface Shared<T> {
  value: T;
  listeners: Set<() => void>;
}

export function useSharedState<T>(shared: Shared<T>): State<T> {
  const [state, setState] = useState<T>(shared.value);

  function setSharedState(value: T): void {
    shared.value = value;
    shared.listeners.forEach((listener) => listener());
  }

  useMount(() => {
    const uContext = userContext.get();
    function handleChange(): void {
      userContext.run(uContext, () => setState(shared.value));
    }

    shared.listeners.add(handleChange);
    return () => shared.listeners.delete(handleChange);
  });

  return [state, setSharedState];
}

export function createSharedState<T>(initial: T): Shared<T> {
  return {
    value: initial,
    listeners: new Set<() => void>(),
  };
}
