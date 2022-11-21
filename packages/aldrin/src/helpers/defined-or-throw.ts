export function definedOrThrow<T>(v: T): asserts v is Exclude<T, null | undefined> {
  if (v == null) {
    throw new Error('Expected value to be defined');
  }
}
