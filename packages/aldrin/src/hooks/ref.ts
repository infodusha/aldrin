import { userContext } from '../context';

/*
  Creates object with `value` property, bound to user
*/
export function useRef<T>(initialValue: T | (() => T), strict = true): Ref<T> {
  return new Ref(initialValue, strict);
}

export class Ref<T> {
  constructor(
    private readonly initialValue: T | (() => T),
    private readonly strict: boolean = false
  ) {}

  get value(): T {
    if (!userContext.has()) {
      if (this.strict) {
        throw new Error('Unable to get ref outside of user context');
      }
      return this.getInitialValue();
    }
    const uContext = userContext.get();
    if (!uContext.refs.has(this)) {
      return this.getInitialValue();
    }
    return uContext.refs.get(this);
  }

  set value(value: T) {
    const uContext = userContext.get();
    uContext.refs.set(this, value);
  }

  private getInitialValue(): T {
    if (typeof this.initialValue === 'function') {
      return (this.initialValue as () => T)();
    }
    return this.initialValue;
  }
}
