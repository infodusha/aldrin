import { definedOrThrow } from './defined-or-throw';

export class SingleEventEmitter<T> {
  protected readonly listeners = new Set<(value: T) => void>();
  protected readonly wrappers = new WeakMap<(value: T) => void, (value: T) => void>();

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
    for (const listener of this.listeners) {
      listener(value);
    }
  }

  clearListeners(): void {
    this.listeners.clear();
  }
}
