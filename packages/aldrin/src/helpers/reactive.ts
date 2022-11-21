import { renderContext, userContext } from '../context';
import { Renderer } from '../render';
import { makeComputed } from './computed';
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

export function bindReactiveToRenderer<T>(reactive: () => T, renderer?: Renderer): () => T {
  const fn = makeComputed<T>(reactive);
  if (renderer == null) {
    throw new Error('Unable to bind computed to renderer (No renderer found?)');
  }
  const rContext = renderContext.get();
  const change = getReactiveChange(fn);

  change.once(() => {
    const uContext = userContext.get();
    renderContext
      .run(rContext, () => renderer.render())
      .then((html) => {
        uContext.bridge.updateElement(html, renderer.id);
      })
      .catch(console.error);
  });

  return fn;
}
