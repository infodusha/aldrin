import { Observable } from 'rxjs';
import { useMount } from './mount';
import { useState } from './state';
import { userContext } from '../context';

export function useAsync<T>(observable$: Observable<T>): () => T | null {
  const [value, setValue] = useState<T | null>(null);

  useMount(() => {
    const uContext = userContext.get();
    const subscription = observable$.subscribe((value) => {
      userContext.run(uContext, () => setValue(value));
    });
    return () => subscription.unsubscribe();
  });

  return value;
}
