export interface Detection<T, R> {
  result: R;
  calls: readonly T[];
}

// TODO bind to own context for async cases
export class CallsDetector<T> {
  private readonly calls = new Set<T>();
  private inEnabled = false;

  detect<R>(fn: () => R): Detection<T, R> {
    this.setEnabled(true);
    const result = fn();
    const calls = [...this.calls];
    this.setEnabled(false);
    return { result, calls };
  }

  call(data: T): void {
    if (this.inEnabled) {
      this.calls.add(data);
    }
  }

  private setEnabled(isEnabled: boolean): void {
    this.inEnabled = isEnabled;
    this.calls.clear();
  }
}
