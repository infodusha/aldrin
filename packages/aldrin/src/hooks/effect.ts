import { useMount } from './mount';
import { stateCallsDetector } from './state';
import { getReactiveChange } from '../helpers/reactive';
import { SingleEventEmitter } from '../helpers/single-event-emitter';

type EffectFn = (() => void) | (() => () => void);

export function useEffect(fn: EffectFn): void {
  let abortController: AbortController;
  let lastResult: ReturnType<EffectFn>;

  function subscribe(): void {
    const { result, calls } = stateCallsDetector.detect(fn);
    lastResult = result;

    const changes = calls.map((reactive) => getReactiveChange(reactive));
    abortController = SingleEventEmitter.mergeOnce(subscribe, changes);
  }

  useMount(() => {
    subscribe();

    return () => {
      abortController.abort();
      lastResult?.();
    };
  });
}
