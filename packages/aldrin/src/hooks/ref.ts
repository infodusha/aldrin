import { userContext } from '../context';

export function useRef<T>(initialValue: T, strict = true): Ref<T> {
  return new Ref(initialValue, strict);
}

export class Ref<T> {
  constructor(private readonly initialValue: T, private readonly strict: boolean = false) {}

  get value(): T {
    if (!userContext.has()) {
      if (this.strict) {
        throw new Error('Unable to get ref outside of user context');
      }
      return this.initialValue;
    }
    const uContext = userContext.get();
    if (!uContext.refs.has(this)) {
      return this.initialValue;
    }
    return uContext.refs.get(this);
  }

  set value(value: T) {
    const uContext = userContext.get();
    uContext.refs.set(this, value);
  }
}
