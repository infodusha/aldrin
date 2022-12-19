import { RenderContext, renderContext } from '../context';
import { render } from '../render';
import { useEffect } from '../hooks/effect';

interface ShowProps {
  when: () => boolean;
  fallback?: JSX.Element;
  children: JSX.Element;
}

export async function Show(props: ShowProps): JSX.AsyncElement {
  let isVisible = props.when();
  const rContextChildren = new RenderContext();
  const rContextFallback = new RenderContext();

  const children = await renderContext.run(rContextChildren, () => render(props.children));
  const fallback =
    props.fallback !== undefined
      ? await renderContext.run(rContextFallback, () => render(props.fallback))
      : null;

  function getActiveContext(): RenderContext {
    return isVisible ? rContextChildren : rContextFallback;
  }

  useEffect(() => {
    const newIsVisible = props.when();
    if (newIsVisible === isVisible) {
      return;
    }
    getActiveContext().mount.unMount();
    isVisible = newIsVisible;
    getActiveContext().mount.mount();

    // const uContext = userContext.get();
    // uContext.bridge.createElement(children, parentId, nodeIndex);

    return () => getActiveContext().mount.unMount();
  });

  return isVisible ? children : fallback;
}
