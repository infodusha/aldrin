import { AnyFunction } from '../types';

const functionMetadataSymbol: unique symbol = Symbol('functionMetadata');

type FunctionWithMetadata<T, M> = T & { [functionMetadataSymbol]: M };

export function bindFunctionMetadata<T extends AnyFunction, M>(
  fn: T,
  metadata: M
): FunctionWithMetadata<T, M> {
  const newFn = (...args: unknown[]): unknown => fn(...args);
  const fnWithMetadata = newFn as FunctionWithMetadata<T, M>;
  fnWithMetadata[functionMetadataSymbol] = metadata;
  return fnWithMetadata;
}

export function getFunctionMetadata<T extends AnyFunction, M>(fn: T): M {
  if (functionMetadataSymbol in fn) {
    return (fn as FunctionWithMetadata<T, M>)[functionMetadataSymbol];
  }
  throw new Error('Function does not have metadata');
}

export function hasFunctionMetadata<T extends AnyFunction>(fn: T): boolean {
  return functionMetadataSymbol in fn;
}
