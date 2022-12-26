import { describe, expect, test } from 'vitest';
import { TestBed } from '../test-bed';

describe('render', () => {
  test('should render null', async () => {
    const result = await TestBed.create(() => null);

    expect(result.html).toBe('');
  });

  test('should render undefined', async () => {
    const result = await TestBed.create(() => undefined);

    expect(result.html).toBe('');
  });

  test('should render number', async () => {
    const result = await TestBed.create(() => 123);

    expect(result.html).toBe('123');
  });

  test('should render string', async () => {
    const result = await TestBed.create(() => 'test string');

    expect(result.html).toBe('test string');
  });

  test('should render boolean', async () => {
    const result = await TestBed.create(() => true);

    expect(result.html).toBe('true');
  });
});
