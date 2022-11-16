import { SingleEventEmitter } from './helpers/single-event-emitter';

const transformEvent = new SingleEventEmitter<JSX.Element>();

export function onNextTransformation(fn: (element: JSX.Element) => void): void {
  transformEvent.once(fn);
}

export function processTransformation(element: JSX.Element): void {
  transformEvent.emit(element);
  transformEvent.clearListeners();
}
