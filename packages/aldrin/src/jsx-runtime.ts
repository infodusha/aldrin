export function jsx(
  type: string,
  props: Record<string, string>,
  ...children: Array<JSX.ELEMENT | string>
): JSX.ELEMENT {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text: string): JSX.ELEMENT {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

declare global {
  namespace JSX {
    interface ELEMENT {
      type: string;
      props: {
        children: Array<JSX.ELEMENT | string>;
        [key: string]: string | Array<JSX.ELEMENT | string>;
      };
    }

    interface IntrinsicElements {
      div: { class?: string };
    }
  }
}
