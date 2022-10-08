import crypto from 'node:crypto';
import { renderContext } from './context';

const singleTags = ['meta', 'img', 'br', 'hr', 'input'];

export function render(item: JSX.Element): string {
  if (item === null || item === undefined) {
    return '';
  }
  if (Array.isArray(item)) {
    return item.map(render).join('');
  }
  if (typeof item === 'object') {
    return renderItem(item);
  }
  return item.toString();
}

export function renderItem({ type, props, children }: JSX.Node): string {
  const propsString = renderProps(props);
  const childrenString = renderChildren(children);
  if (singleTags.includes(type)) {
    if (childrenString.length > 0) {
      throw new Error(`Single tag "${type}" cannot have children`);
    }
    return `<${type}${propsString}>`;
  }
  return `<${type}${propsString}>${childrenString}</${type}>`;
}

function renderProps(props?: Record<string, JSX.FunctionMaybe>): string {
  if (props == null || Object.keys(props).length === 0) {
    return '';
  }
  const id = crypto.randomUUID();
  const rendered = Object.entries(props)
    .map(([key, value]) => renderProp(key, value, id))
    .join(' ');
  return ` id="${id}" ${rendered}`;
}

function renderProp(key: string, value: JSX.FunctionMaybe, id: string): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return `${key}="${value.toString()}"`;
  }
  if (typeof value === 'function') {
    if (key.startsWith('on')) {
      const context = renderContext.get();
      context.events.set(id + key, value as (...args: unknown[]) => void);
      return `${key}="onEvent('${key}', this)"`;
    } else {
      // TODO watch value
    }
  }
  throw new Error('Unsupported property value type ' + typeof value);
}

function renderChildren(children?: JSX.Element): string {
  if (children === null || children === undefined) {
    return '';
  }
  if (Array.isArray(children)) {
    return children.map(renderChildren).join('');
  }
  if (typeof children === 'object') {
    return render(children);
  }
  return children.toString();
}
