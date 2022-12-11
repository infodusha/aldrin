import { TestBed } from '../test-bed';
import { useMount } from './mount';
import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';

function dummyComponent(mocks: { mountMock: Mock; unmountMock: Mock }): JSX.Element {
  useMount(() => {
    mocks.mountMock();
    return () => {
      mocks.unmountMock();
    };
  });

  return null;
}

describe('useMount hook', () => {
  const mountMock = vi.fn();
  const unmountMock = vi.fn();
  let testBed: TestBed;

  beforeEach(async () => {
    mountMock.mockClear();
    unmountMock.mockClear();
    testBed = await TestBed.create(() => dummyComponent({ mountMock, unmountMock }));
  });

  test('should call mount', () => {
    expect(mountMock).not.toHaveBeenCalled();
    testBed.init();
    expect(mountMock).toHaveBeenCalledTimes(1);
    expect(unmountMock).not.toHaveBeenCalled();
  });

  test('should call unMount', () => {
    expect(unmountMock).not.toHaveBeenCalled();
    testBed.init();
    expect(mountMock).toHaveBeenCalledTimes(1);
    expect(unmountMock).not.toHaveBeenCalled();
    testBed.destroy();
    expect(mountMock).toHaveBeenCalledTimes(1);
    expect(unmountMock).toHaveBeenCalledTimes(1);
  });
});
