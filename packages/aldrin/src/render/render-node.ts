import crypto from 'node:crypto';
import { renderContext, userContext } from '../context';
import { findChildIndex, renderTree, TreeNode, render } from './index';
import { setComputedListener } from '../helpers/computed';
import { getConnectionStr } from '../components/connection';

const singleTags: Readonly<string[]> = ['meta', 'img', 'br', 'hr', 'input'];

export class RenderNode {
  readonly id = crypto.randomUUID();

  constructor(public readonly item: TreeNode) {}

  private getProps(): string {
    const props = { ...this.item.props, id: this.id };

    return Object.entries(props)
      .map(([key, value]) => this.renderProp(key, value))
      .join(' ');
  }

  private getChildren(): string {
    const children = this.item.children.map((i) => renderTree(i, this)).join('');
    if (this.item.type === 'body') {
      this.markHasBody();
      return children + getConnectionStr();
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
    if (this.item.children.length !== 0) {
      throw new Error(`Single tag "${this.item.type}" cannot have children`);
    }
    return `<${this.item.type} ${this.getProps()}>`;
  }

  private renderProp(key: string, value: JSX.FunctionMaybe): string {
    if (typeof value === 'string' || typeof value === 'number') {
      return `${key}="${value.toString()}"`;
    }
    if (typeof value === 'function') {
      return this.renderPropFunction(key, value as () => unknown);
    }
    throw new Error('Unsupported property value type ' + typeof value);
  }

  private bindReactiveProp(reactive: () => string, key: string): string {
    return setComputedListener(reactive, (value) => {
      const uContext = userContext.get();
      uContext.bridge.patchProp(this.id, key, value);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private renderPropFunction(key: string, fn: () => any): string {
    if (key.startsWith('on')) {
      const context = renderContext.get();
      context.events.set(this.id + key, fn);
      return `${key}="onEvent('${key}', this)"`;
    } else {
      const value = this.bindReactiveProp(fn, key);
      return `${key}="${value}"`;
    }
  }

  bindReactive(reactive: JSX.ReactiveElement): ReturnType<JSX.ReactiveElement> {
    const rContext = renderContext.get();
    return setComputedListener(reactive, (value) => {
      const uContext = userContext.get();
      const index = findChildIndex(this.item, reactive);
      renderContext
        .run(rContext, () => render(value))
        .then((html) => {
          uContext.bridge.updateElement(html, this.id, index, 1);
        })
        .catch(console.error);
    });
  }

  render(): string {
    if (singleTags.includes(this.item.type)) {
      return this.renderSingleTag();
    }
    return `<${this.item.type} ${this.getProps()}>${this.getChildren()}</${this.item.type}>`;
  }
}
