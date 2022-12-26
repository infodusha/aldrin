import { distinctUntilChanged, skip, startWith } from 'rxjs';
import { RenderContext, renderContext, userContext } from '../context';
import {
  findChildIndex,
  isNode,
  isUnsafeString,
  render,
  TreeItem,
  TreeNode,
  unsafe,
} from '../render/';
import { makeComputed } from '../helpers/computed';
import { useMount } from '../hooks/mount';

interface ShowProps {
  when: () => boolean;
  fallback?: JSX.Element;
  children: JSX.Element;
}

export async function Show(props: ShowProps): JSX.AsyncElement {
  const computed = makeComputed(props.when);
  let lastIsVisible = computed.initial;

  const rContext = renderContext.get();

  let rContextChildren: RenderContext;

  async function renderChildren(): Promise<string> {
    rContextChildren = new RenderContext();
    return await renderContext.run(rContextChildren, () => render(props.children));
  }

  function unMount(): void {
    if (lastIsVisible) {
      rContextChildren.mount.unMount();
    }
  }

  const children = await renderChildren();
  const result = unsafe(computed.initial ? children : '');

  useMount(() => {
    if (computed.initial) {
      rContextChildren.mount.mount();
    }

    const subscription = computed.change$
      .pipe(startWith(computed.initial), distinctUntilChanged(), skip(1))
      .subscribe(handleChange);
    return () => {
      subscription.unsubscribe();
      unMount();
    };
  });

  function findParentInChildren(item: TreeItem): TreeNode | null {
    if (isUnsafeString(item) && item === result) {
      throw new Error('Show is root element');
    }
    if (isNode(item)) {
      for (const child of item.children) {
        if (isUnsafeString(child) && child === result) {
          return item;
        }
        if (isNode(child)) {
          const i = findParentInChildren(child);
          if (i !== null) {
            return i;
          }
        }
      }
    }
    return null;
  }

  function handleChange(isVisible: boolean): void {
    const uContext = userContext.get();
    const parent = findParentInChildren(rContext.treeRoot);
    if (parent === null) {
      throw new Error('Unable to find parent');
    }

    if (!isVisible) {
      // visible -> hidden
      rContextChildren.mount.unMount();
      const id = rContext.treeNodeToId.get(parent);
      if (id == null) {
        throw new Error('Unable to find parent id');
      }
      const index = findChildIndex(parent, result);
      const num = Array.isArray(props.children) ? props.children.length : 1;
      uContext.bridge.removeElement(id, index, num);
      lastIsVisible = isVisible;
    }

    if (isVisible) {
      // hidden -> visible
      renderChildren()
        .then((newChildren) => {
          const id = rContext.treeNodeToId.get(parent);
          if (id == null) {
            throw new Error('Unable to find parent id');
          }
          const index = findChildIndex(parent, result);
          uContext.bridge.createElement(newChildren, id, index);
          rContextChildren.mount.mount();
          lastIsVisible = isVisible;
        })
        .catch(console.error);
    }
  }

  return result;
}
