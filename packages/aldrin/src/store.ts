import { RenderContext } from './context';

const renderContexts = new Map<string, RenderContext>();

export function storeRenderContext(uuid: string, context: RenderContext): void {
  renderContexts.set(uuid, context);
}

export function removeRenderContext(context: RenderContext): void {
  for (const [uuid, storedContext] of renderContexts) {
    if (storedContext === context) {
      renderContexts.delete(uuid);
      return;
    }
  }
}

export function getRenderContext(uuid: string): RenderContext {
  const context = renderContexts.get(uuid);
  if (context === undefined) {
    throw new Error('Unable to find render context');
  }
  return context;
}
