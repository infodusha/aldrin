import { useMount } from '../hooks/mount';
import { RenderContext, renderContext } from '../context';
import { render } from '../render';
import { makeComputed } from '../helpers/computed';
import { getReactiveChange } from '../helpers/reactive';

interface ShowProps {
  when: () => boolean;
  fallback?: JSX.Element;
  children: JSX.Element;
}

export async function Show(props: ShowProps): JSX.AsyncElement {
  const when = makeComputed(props.when);
  const initial = when();
  const change = getReactiveChange(when);

  const rContextChildren = new RenderContext();
  const rContextFallback = new RenderContext();

  const children = await renderContext.run(rContextChildren, () => render(props.children));
  const fallback =
    props.fallback !== undefined
      ? await renderContext.run(rContextFallback, () => render(props.fallback))
      : null;

  useMount(() => {
    let value = initial;

    function handleChange(newValue: boolean): void {
      if (newValue === value) {
        return;
      }
      value = newValue;
      if (newValue) {
        rContextFallback.mount.unMount();

        // TODO - create elements
        // const uContext = userContext.get();
        // uContext.bridge.createElement(children, parentId, nodeIndex);

        rContextChildren.mount.mount();
      } else {
        rContextChildren.mount.unMount();
        rContextFallback.mount.mount();
      }
    }

    if (value) {
      rContextChildren.mount.mount();
    } else {
      rContextFallback.mount.mount();
    }

    change.addListener(handleChange);

    return () => {
      change.removeListener(handleChange);
      if (value) {
        rContextChildren.mount.unMount();
      } else {
        rContextFallback.mount.unMount();
      }
    };
  });

  return initial ? children : fallback;
}
