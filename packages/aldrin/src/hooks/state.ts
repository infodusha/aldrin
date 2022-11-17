import { renderContext, userContext } from '../context';
import { useRef } from './ref';
import { makeReactive, processReactiveRenderers } from '../helpers/reactive';
import { readState } from '../helpers/computed';

/*
  Creates a tuple `[get, set]`, bound to user

  Changes will trigger rerender
*/
export function useState<T>(initialValue: T): [() => T, (value: T) => void] {
  const ref = useRef<T>(initialValue, false);
  const rContext = renderContext.get();

  const get: () => T = makeReactive(() => {
    readState(get);
    return ref.value;
  });

  function set(value: T): void {
    ref.value = value;
    const uContext = userContext.get();

    renderContext.run(rContext, () => {
      processReactiveRenderers(get, (renderer) => {
        const html = renderContext.run(rContext, () => renderer.render());
        uContext.bridge.updateElement(html, renderer.id);
      });
    });
  }

  return [get, set];
}
