import {
  bindFunctionMetadata,
  hasFunctionMetadata,
  getFunctionMetadata,
} from './function-metadata';
import { AnyFunction } from '../types';
import { renderContext } from '../context';
import { Renderer } from '../render';
import { makeComputed } from './computed';

const reactiveSymbol: unique symbol = Symbol('reactive');

export function makeReactive<T>(fn: () => T): () => T {
  return bindFunctionMetadata(fn, reactiveSymbol);
}

export function isReactive(fn: AnyFunction): boolean {
  return hasFunctionMetadata(fn) && getFunctionMetadata(fn) === reactiveSymbol;
}

function getReactiveRenderers<T>(fn: () => T, warnIfEmpty = true): Set<Renderer> {
  const rContext = renderContext.get();
  const renderers = rContext.reactiveToRenderers.get(fn) ?? new Set<Renderer>();
  if (warnIfEmpty && renderers.size === 0) {
    console.warn('Reactive is not rendered');
  }
  return renderers;
}

export function bindReactiveToRenderer(
  item: JSX.FunctionElement,
  renderer?: Renderer
): () => JSX.Element {
  const fn = makeComputed(item);
  if (renderer == null) {
    throw new Error('Unable to bind computed to renderer (No renderer found?)');
  }
  const rContext = renderContext.get();
  const renderers = getReactiveRenderers(fn, false);
  renderers.add(renderer);
  rContext.reactiveToRenderers.set(fn, renderers);
  return fn;
}

export function processReactiveRenderers(
  fn: AnyFunction,
  callback: (renderer: Renderer) => void
): void {
  const renderers = getReactiveRenderers(fn, true);
  const renderersArray = Array.from(renderers);
  renderers.clear();
  renderersArray.forEach((renderer) => {
    callback(renderer);
  });
}
