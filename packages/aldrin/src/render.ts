import crypto from 'node:crypto';
import { renderContext } from './context';
import { Connection } from './components/connection';
import { bindReactiveToRenderer, makeReactive } from './helpers/reactive';

const singleTags = ['meta', 'img', 'br', 'hr', 'input'];

export function render(item: JSX.Element, renderer?: Renderer): string {
  if (item === null || item === undefined) {
    return '';
  }
  if (Array.isArray(item)) {
    return item.map((c) => render(c, renderer)).join('');
  }
  if (typeof item === 'function') {
    const fn = bindReactiveToRenderer(item, renderer);
    return render(fn(), renderer);
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

  private get children(): string {
    const children = render(this.item.children, this);
    if (this.tag === 'body') {
      this.markHasBody();
      // Make reactive as we pass component function
      return children + render(makeReactive(Connection), this);
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
