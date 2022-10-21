export class SingleEventEmitter<T> {
  protected readonly listeners = new Set<(value: T) => void>();

  addListener(listener: (value: T) => void): void {
    this.listeners.add(listener);
  }

  once(listener: (value: T) => void): void {
    const wrapper = (value: T): void => {
      this.removeListener(wrapper);
      listener(value);
    };
    this.addListener(wrapper);
  }

  removeListener(listener: (value: T) => void): void {
    this.listeners.delete(listener);
  }

  emit(value: T): void {
    for (const listener of this.listeners) {
      listener(value);
    }
  }
}
