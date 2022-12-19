import crypto from 'node:crypto';
import { renderContext, userContext } from '../context';
import { findChildIndex, renderTree, TreeNode, render } from './index';
import { makeComputed } from '../helpers/computed';
import { getReactiveChange } from '../helpers/reactive';
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
      return this.renderPropFunction(key, value as (...args: unknown[]) => any);
    }
    throw new Error('Unsupported property value type ' + typeof value);
  }

  private bindReactiveProp(reactive: () => string, key: string): string {
    const fn = makeComputed<string>(reactive);
    const change = getReactiveChange(fn);

    change.addListener(() => {
      const newValue = fn();
      const uContext = userContext.get();
      uContext.bridge.patchProp(this.id, key, newValue);
    });

    return fn();
  }

  private renderPropFunction(key: string, fn: (...args: unknown[]) => any): string {
    if (key.startsWith('on')) {
      const context = renderContext.get();
      context.events.set(this.id + key, fn);
      return `${key}="onEvent('${key}', this)"`;
    } else {
      const value = this.bindReactiveProp(fn, key);
      return `${key}="${value}"`;
    }
  }

  bindReactive(reactive: JSX.ReactiveElement): JSX.ReactiveElement {
    const fn = makeComputed<ReturnType<JSX.ReactiveElement>>(reactive);
    const rContext = renderContext.get();
    const change = getReactiveChange(fn);

    change.addListener((value) => {
      const index = findChildIndex(this.item, reactive);
      const uContext = userContext.get();
      renderContext
        .run(rContext, () => render(value))
        .then((html) => {
          uContext.bridge.updateElement(html, this.id, index, 1);
        })
        .catch(console.error);
    });

    return fn;
  }

  render(): string {
    if (singleTags.includes(this.item.type)) {
      return this.renderSingleTag();
    }
    return `<${this.item.type} ${this.getProps()}>${this.getChildren()}</${this.item.type}>`;
  }
}
