import { renderContext, userContext } from '../context';
import { useRef } from './ref';

const stateGetterSymbol: unique symbol = Symbol('stateGetter');

export interface StateGetter<T> {
  (): T;
  [stateGetterSymbol]: true;
}

export function useState<T>(initialValue: T): [() => T, (value: T) => void] {
  const ref = useRef<T>(initialValue, false);
  const rContext = renderContext.get();

  function get(): T {
    return ref.value;
  }

  const stateGetter = get as StateGetter<T>;
  stateGetter[stateGetterSymbol] = true;

  function set(value: T): void {
    ref.value = value;
    const renderer = rContext.stateGetterToRenderer.get(stateGetter);
    if (renderer == null) {
      throw new Error('Unable to find renderer');
    }

    const uContext = userContext.get();

    const html = renderContext.run(rContext, () => renderer.render());
    uContext.bridge.updateElement(html, renderer.id);
  }

  return [get, set];
}

export function isStateGetter<T>(fn: () => T): fn is StateGetter<T> {
  return stateGetterSymbol in fn;
}
