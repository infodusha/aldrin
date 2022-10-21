import crypto from 'node:crypto';
import { renderContext } from './context';
import { Connection } from './components/connection';

const singleTags = ['meta', 'img', 'br', 'hr', 'input'];

export function render(item: JSX.Element): string {
  if (item === null || item === undefined) {
    return '';
  }
  if (Array.isArray(item)) {
    return item.map(render).join('');
  }
  if (typeof item === 'function') {
    return renderFunction(item as () => JSX.Node);
  }
  if (typeof item === 'object') {
    // TODO remove fn here
    return renderTag(item, () => item);
  }
  return item.toString();
}

function renderFunction(fn: () => JSX.Node): string {
  const item = fn();
  if (item !== null && typeof item === 'object') {
    return renderTag(item, fn);
  }
  return render(item);
}

export function renderTag({ type, props, children }: JSX.Node, element: () => JSX.Node): string {
  const id = crypto.randomUUID();
  bindElementToStates(element, id);

  const propsString = renderProps(id, props);
  const childrenString = render(children);
  if (singleTags.includes(type)) {
    return renderSingleTag(type, propsString, childrenString);
  }
  const childrenStringModified = childrenString + injectConnectionIfBody(type);
  return `<${type} ${propsString}>${childrenStringModified}</${type}>`;
}

function renderSingleTag(type: string, propsString: string, childrenString: string): string {
  if (childrenString.length > 0) {
    throw new Error(`Single tag "${type}" cannot have children`);
  }
  return `<${type} ${propsString}>`;
}

function injectConnectionIfBody(type: string): string {
  if (type !== 'body') {
    return '';
  }
  const context = renderContext.get();
  context.hasBody = true;
  return render(Connection);
}

function renderProps(id: string, props?: Record<string, JSX.FunctionMaybe>): string {
  const propsList = { ...props, id };

  return Object.entries(propsList)
    .map(([key, value]) => renderProp(key, value, id))
    .join(' ');
}

function renderProp(key: string, value: JSX.FunctionMaybe, id: string): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return `${key}="${value.toString()}"`;
  }
  if (typeof value === 'function') {
    return renderPropFunction(key, value, id);
  }
  throw new Error('Unsupported property value type ' + typeof value);
}

function renderPropFunction(key: string, value: JSX.FunctionMaybe, id: string): string {
  if (key.startsWith('on')) {
    const context = renderContext.get();
    context.events.set(id + key, value as (...args: unknown[]) => void);
    return `${key}="onEvent('${key}', this)"`;
  } else {
    throw new Error('Unable to watch property yet');
    // TODO watch value
  }
}

function bindElementToStates(element: () => JSX.Node, id: string): void {
  const context = renderContext.get();
  context.callsDetector.bindElementToStates(element, id);
}
