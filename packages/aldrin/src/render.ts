import crypto from 'node:crypto';
import { renderContext } from './context';
import { Connection } from './components/connection';
import { bindReactiveToRenderer } from './helpers/reactive';

const singleTags = ['meta', 'img', 'br', 'hr', 'input'];

export async function render(item: JSX.Element, renderer?: Renderer): Promise<string> {
  if (item instanceof Promise) {
    const data = await (item as JSX.AsyncElement);
    return render(data, renderer);
  }
  if (item === null || item === undefined) {
    return '';
  }
  if (Array.isArray(item)) {
    const promises = item.map((c) => render(c, renderer));
    const results = await Promise.all(promises);
    return results.join('');
  }
  if (typeof item === 'function') {
    const fn = bindReactiveToRenderer(item, renderer);
    return await render(fn(), renderer);
  }
  if (typeof item === 'object') {
    return new Renderer(item).render();
  }
  return item.toString();
}

export class Renderer {
  readonly id = crypto.randomUUID();

  constructor(public readonly item: JSX.Node) {}

  private get tag(): string {
    return this.item.type;
  }

  private get props(): string {
    const props = { ...this.item.props, id: this.id };

    return Object.entries(props)
      .map(([key, value]) => this.renderProp(key, value))
      .join(' ');
  }

  private async getChildren(): Promise<string> {
    const children = await render(this.item.children, this);
    if (this.tag === 'body') {
      this.markHasBody();
      const connection = await render(Connection());
      return children + connection;
    }
    return children;
  }

  private markHasBody(): void {
    const context = renderContext.get();
    if (context.hasBody) {
      throw new Error('Body tag already exists');
    }
    context.hasBody = true;
  }

  private renderSingleTag(): string {
    if (this.item.children != null) {
      throw new Error(`Single tag "${this.tag}" cannot have children`);
    }
    return `<${this.tag} ${this.props}>`;
  }

  private renderProp(key: string, value: JSX.FunctionMaybe): string {
    if (typeof value === 'string' || typeof value === 'number') {
      return `${key}="${value.toString()}"`;
    }
    if (typeof value === 'function') {
      return this.renderPropFunction(key, value as (...args: unknown[]) => any);
    }
    throw new Error('Unsupported property value type ' + typeof value);
  }

  private renderPropFunction(key: string, value: (...args: unknown[]) => any): string {
    if (key.startsWith('on')) {
      const context = renderContext.get();
      context.events.set(this.id + key, value);
      return `${key}="onEvent('${key}', this)"`;
    } else {
      const fn = bindReactiveToRenderer(value, this);
      return fn();
    }
  }

  async render(): Promise<string> {
    if (singleTags.includes(this.tag)) {
      return this.renderSingleTag();
    }
    const children = await this.getChildren();
    return `<${this.tag} ${this.props}>${children}</${this.tag}>`;
  }
}
