import { describe, expect, test } from 'vitest';
import { render } from './index';

describe('render', () => {
  test('should render null', async () => {
    const result = await render(null);

    expect(result).toBe('');
  });

  test('should render undefined', async () => {
    const result = await render(undefined);

    expect(result).toBe('');
  });

  test('should render number', async () => {
    const result = await render(123);

    expect(result).toBe('123');
  });

  test('should render string', async () => {
    const result = await render('test string');

    expect(result).toBe('test string');
  });

  test('should render boolean', async () => {
    const result = await render(true);

    expect(result).toBe('true');
  });
});
