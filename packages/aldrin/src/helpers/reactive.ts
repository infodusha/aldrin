import { SingleEventEmitter } from './single-event-emitter';
import { definedOrThrow } from './defined-or-throw';

const reactiveMetadataMap = new WeakMap<() => unknown, SingleEventEmitter<any>>();

export function makeReactive<T>(fn: () => T): SingleEventEmitter<T> {
  const change = new SingleEventEmitter<T>();
  reactiveMetadataMap.set(fn, change);
  return change;
}

export function isReactive(fn: () => unknown): boolean {
  return reactiveMetadataMap.has(fn);
}

export function getReactiveChange<T>(fn: () => T): SingleEventEmitter<T> {
  if (!isReactive(fn)) {
    throw new Error('Not reactive');
  }
  const change = reactiveMetadataMap.get(fn);
  definedOrThrow(change);
  return change;
}
