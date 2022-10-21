import crypto from 'node:crypto';
import { renderContext } from './context';
import { Connection } from './components/connection';

const singleTags = ['meta', 'img', 'br', 'hr', 'input'];

export function render(item: JSX.Element, id?: string): string {
  if (item === null || item === undefined) {
    return '';
  }
  if (Array.isArray(item)) {
    return item.map((c) => render(c)).join('');
  }
  if (typeof item === 'function') {
    const element = item as () => JSX.Node;
    const id = crypto.randomUUID();
    bindElementToStates(element, id);
    return render(element(), id);
  }
  if (typeof item === 'object') {
    return new Renderer(item, id ?? crypto.randomUUID()).render();
  }
  return item.toString();
}

function bindElementToStates(element: () => JSX.Node, id: string): void {
  const context = renderContext.get();
  context.callsDetector.bindElementToStates(element, id);
}

class Renderer {
  constructor(private readonly item: JSX.Node, private readonly id: string) {}

  private get tag(): string {
    return this.item.type;
  }

  private get props(): string {
    const props = { ...this.item.props, id: this.id };

    return Object.entries(props)
      .map(([key, value]) => this.renderProp(key, value))
      .join(' ');
  }

  private get children(): string {
    const children = render(this.item.children);
    if (this.tag === 'body') {
      const context = renderContext.get();
      context.hasBody = true;
      return children + render(Connection);
    }
    return children;
  }

  private renderSingleTag(): string {
    if (this.children.length > 0) {
      throw new Error(`Single tag "${this.tag}" cannot have children`);
    }
    return `<${this.tag} ${this.props}>`;
  }

  private renderProp(key: string, value: JSX.FunctionMaybe): string {
    if (typeof value === 'string' || typeof value === 'number') {
      return `${key}="${value.toString()}"`;
    }
    if (typeof value === 'function') {
      return this.renderPropFunction(key, value);
    }
    throw new Error('Unsupported property value type ' + typeof value);
  }

  private renderPropFunction(key: string, value: JSX.FunctionMaybe): string {
    if (key.startsWith('on')) {
      const context = renderContext.get();
      context.events.set(this.id + key, value as (...args: unknown[]) => void);
      return `${key}="onEvent('${key}', this)"`;
    } else {
      throw new Error('Unable to watch property yet');
      // TODO watch value
    }
  }

  render(): string {
    if (singleTags.includes(this.tag)) {
      return this.renderSingleTag();
    }
    return `<${this.tag} ${this.props}>${this.children}</${this.tag}>`;
  }
}
