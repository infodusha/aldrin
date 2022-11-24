import { renderContext, userContext } from '../context';
import { render, Renderer } from '../render';
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
  if (renderer == null) {
    throw new Error('Unable to bind computed to renderer (No renderer found?)');
  }
  const index = renderer.findChildIndex(reactive as JSX.FunctionElement); // FIXME - this is a type hack
  const fn = makeComputed<T>(reactive);
  const rContext = renderContext.get();
  const change = getReactiveChange(fn);

  change.addListener((value) => {
    const uContext = userContext.get();
    renderContext
      .run(rContext, () => render(value as JSX.Element)) // FIXME - this is a type hack
      .then((html) => {
        uContext.bridge.updateElement(html, renderer.id, index, 1);
      })
      .catch(console.error);
  });

  return fn;
}
