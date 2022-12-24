import { Observable } from 'rxjs';
import { useMount } from './mount';
import { useState } from './state';

export function useAsync<T>(observable$: Observable<T>): () => T | null {
  const [value, setValue] = useState<T | null>(null);

  useMount(() => {
    const subscription = observable$.subscribe(setValue);
    return () => subscription.unsubscribe();
  });

  return value;
}
