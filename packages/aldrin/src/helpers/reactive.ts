import { Observable, Subject } from 'rxjs';
import { definedOrThrow } from './defined-or-throw';
import { useCleanup } from '../hooks/mount';

const reactiveMetadataMap = new WeakMap<() => unknown, Observable<any>>();

export function makeReactive<T>(fn: () => T): Subject<T> {
  const change = new Subject<T>();
  reactiveMetadataMap.set(fn, change.asObservable());
  useCleanup(() => change.complete());
  return change;
}

export function isReactive(fn: () => unknown): boolean {
  return reactiveMetadataMap.has(fn);
}

export function getReactiveChange<T>(fn: () => T): Observable<T> {
  if (!isReactive(fn)) {
    throw new Error('Not reactive');
  }
  const change = reactiveMetadataMap.get(fn);
  definedOrThrow(change);
  return change;
}
