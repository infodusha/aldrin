import { getReactiveChange } from '../helpers/reactive';
import { useMount } from './mount';
import { SingleEventEmitter } from '../helpers/single-event-emitter';

export function useWatch(fn: () => void, reactives: Array<() => void>): void {
  const abortController = new AbortController();
  const changes = reactives.map((reactive) => getReactiveChange(reactive));

  useMount(() => {
    SingleEventEmitter.merge(fn, changes, abortController.signal);
    return () => abortController.abort();
  });
}
