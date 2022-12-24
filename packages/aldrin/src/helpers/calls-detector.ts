import { Context } from '../context';

export interface Detection<T, R> {
  result: R;
  calls: readonly T[];
}

export class CallsDetector<T> {
  private readonly callContext = new Context<Set<T>>();

  detect<R>(fn: () => R): Detection<T, R> {
    const callsSet = new Set<T>();
    const result = this.callContext.run(callsSet, fn);
    const calls = [...callsSet];
    return { result, calls };
  }

  call(data: T): void {
    if (this.callContext.has()) {
      this.callContext.get().add(data);
    }
  }
}
