import { definedOrThrow } from './defined-or-throw';

export class SingleEventEmitter<T> {
  protected readonly listeners = new Set<(value: T) => void>();
  protected readonly wrappers = new WeakMap<(value: T) => void, (value: T) => void>();

  static merge(
    cb: () => void,
    emitters: Array<SingleEventEmitter<any>>,
    signal: AbortSignal
  ): void {
    if (signal.aborted) {
      throw new Error('Signal is aborted');
    }

    for (const emitter of emitters) {
      emitter.addListener(cb);
    }

    function clear(): void {
      for (const emitter of emitters) {
        emitter.removeListener(cb);
      }
      signal.removeEventListener('abort', clear);
    }

    signal.addEventListener('abort', clear);
  }

  static mergeOnce(cb: () => void, emitters: Array<SingleEventEmitter<any>>): AbortController {
    const abortController = new AbortController();
    SingleEventEmitter.merge(
      () => {
        abortController.abort();
        cb();
      },
      emitters,
      abortController.signal
    );
    return abortController;
  }

  addListener(listener: (value: T) => void): void {
    this.listeners.add(listener);
  }

  once(listener: (value: T) => void): void {
    const wrapper = (value: T): void => {
      this.removeListener(wrapper);
      listener(value);
    };
    this.wrappers.set(listener, wrapper);
    this.addListener(wrapper);
  }

  removeListener(listener: (value: T) => void): void {
    this.listeners.delete(listener);
    if (this.wrappers.has(listener)) {
      const wrapper = this.wrappers.get(listener);
      definedOrThrow(wrapper);
      this.listeners.delete(wrapper);
    }
  }

  emit(value: T): void {
    // Copy to prevent infinite loop
    const listeners = [...this.listeners];
    for (const listener of listeners) {
      listener(value);
    }
  }
}
