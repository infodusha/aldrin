import { State } from '../hooks/state';
import { renderContext, userContext } from '../context';
import { render } from '../render';

interface Meta {
  element: () => JSX.Node;
  id: string;
}

export class CallsDetector {
  private readonly currentStates = new Set<State<any>>();
  private readonly stateToMeta = new WeakMap<State<any>, Meta[]>();

  addState(state: State<any>): void {
    this.currentStates.add(state);
    const rContext = renderContext.get();
    state.change.addListener(() => {
      const metas = this.stateToMeta.get(state)!;
      metas.forEach(({ id, element }) => {
        const uContext = userContext.get();
        const html = renderContext.run(rContext, () => render(element));
        uContext.bridge.updateElement(html, id);
      });
    });
  }

  bindElementToStates(element: () => JSX.Node, id: string): void {
    if (this.currentStates.size === 0) {
      return;
    }
    this.currentStates.forEach((state) => {
      const metas = this.stateToMeta.get(state) ?? [];
      const newMetas = metas.filter((item) => item.element !== element);
      this.stateToMeta.set(state, newMetas);
      newMetas.push({ id, element });
    });
    this.currentStates.clear();
  }
}
