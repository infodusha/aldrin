import { renderContext, userContext } from '../context';
import { SingleEventEmitter } from '../helpers/single-event-emitter';

export function useState<T>(initialValue: T): [() => T, (value: T) => void] {
  const state: State<T> = new State<T>(initialValue);

  function get(): T {
    return state.value;
  }

  function set(value: T): void {
    state.value = value;
  }

  return [get, set];
}

export class State<T> {
  readonly change = new SingleEventEmitter<T>();

  constructor(private readonly initialValue: T) {}

  get value(): T {
    if (renderContext.has()) {
      // We may want to get state outside of render process
      // So it is safe to ignore
      const rContext = renderContext.get();
      rContext.callsDetector.addState(this);
    }

    if (!userContext.has()) {
      return this.initialValue;
    }
    const uContext = userContext.get();
    if (!uContext.states.has(this)) {
      return this.initialValue;
    }
    return uContext.states.get(this);
  }

  set value(value: T) {
    const uContext = userContext.get();
    uContext.states.set(this, value);
    this.change.emit(value);
  }
}
