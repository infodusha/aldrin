import { callMounts, callUnMounts, useMount } from '../hooks/mount';
import { RenderContext, renderContext } from '../context';
import { render } from '../render';

interface ShowProps {
  when: () => boolean;
  children: JSX.Element;
}

export function Show(props: ShowProps): JSX.Element {
  const rContext = new RenderContext();

  const children = renderContext.run(rContext, () => render(props.children));

  const shown = props.when();

  useMount(() => {
    // TODO subscribe on state changes

    if (shown) {
      callMounts(rContext);
    }

    return callUnMounts(rContext);
  });

  return shown ? children : null;
}
