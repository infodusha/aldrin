import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watchExclude: ['**/node_modules/**', '**/dist/**', 'README.md'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
