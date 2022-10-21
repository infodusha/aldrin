import { useMount } from '../hooks/mount';
import { RenderContext, renderContext } from '../context';

interface ShowProps {
  when: boolean;
  fallback?: JSX.Element;
  children: JSX.Element;
}

// TODO that is a draft
export function Show(props: ShowProps): JSX.Element {
  const rContext = new RenderContext();

  // const children = renderContext.run(rContext, () => render(() => props.children));

  useMount(() => {
    // TODO subscribe on state changes

    if (props.when) {
      rContext.mount.mount();
    }

    return rContext.mount.unMount();
  });

  return () => (props.when ? renderContext.run(rContext, () => props.children) : null);
}
