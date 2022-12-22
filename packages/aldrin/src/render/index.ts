import { RenderNode } from './render-node';

export async function render(item: JSX.Element): Promise<string> {
  const tree = await buildTree(item);
  return renderTree(tree);
}

export interface TreeNode {
  type: string;
  props?: JSX.Node['props'];
  children: TreeItem[];
  parent?: TreeNode;
}

export type TreeItem =
  | Exclude<JSX.Element, Promise<JSX.Element> | JSX.Node | JSX.ArrayElement>
  | TreeNode
  | TreeItem[];

function isNode(item: JSX.Element): item is JSX.Node {
  return typeof item === 'object' && item !== null && 'type' in item;
}

function isUnsafeString(item: JSX.Element): item is JSX.UnsafeString {
  return typeof item === 'object' && item !== null && 'unsafe' in item;
}

async function buildTree(item: JSX.Element, parent?: TreeNode): Promise<TreeItem> {
  if (item instanceof Promise) {
    const data = await item;
    return buildTree(data, parent);
  }
  if (Array.isArray(item)) {
    return await Promise.all(item.map((i) => buildTree(i, parent)));
  }
  if (isNode(item)) {
    const children = item.children ?? [];
    const childrenArr = Array.isArray(children) ? children : [children];
    const childrenTree: TreeItem[] = [];
    const node = {
      type: item.type,
      props: item.props,
      children: childrenTree,
      parent,
    };
    const newChildrenTree = await Promise.all(childrenArr.map((i) => buildTree(i, node)));
    newChildrenTree.forEach((c) => childrenTree.push(c));
    return node;
  }
  return item;
}

export function renderTree(item: TreeItem, parent?: RenderNode): string {
  if (item === null || item === undefined) {
    return '';
  }
  if (Array.isArray(item)) {
    return item.map((i) => renderTree(i, parent)).join('');
  }
  if (typeof item === 'function') {
    if (parent == null) {
      throw new Error('Unable to render function without parent');
    }
    const fn = parent.bindReactive(item);
    const result = renderTree(fn(), parent);
    return `<!-- -->${result}<!-- -->`; // Make sure that will be a different node
  }
  if (isNode(item)) {
    const renderNode = new RenderNode(item);
    return renderNode.render();
  }
  if (isUnsafeString(item)) {
    return item.unsafe;
  }
  if (typeof item === 'string') {
    return escapeHtml(item);
  }
  return item.toString();
}

export function findChildIndex(parent: TreeNode, item: TreeItem): number {
  return parent.children.findIndex((c) => c === item);
}

export function unsafe(str: string): JSX.UnsafeString {
  return { unsafe: str };
}

function escapeHtml(html: string): string {
  return html.replace(/[^0-9A-Za-z ]/g, (c) => `&#${c.charCodeAt(0)};`);
}
