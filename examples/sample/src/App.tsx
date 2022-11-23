import { Show, useMount, useState } from "aldrin";

export function App(): JSX.Element {
  useMount(() => {
    console.log("mount");
    return () => {
      console.log("unmount");
    };
  });

  return (
    <html>
      <body>
        <input />
        <br />
        <Test prop={2}>children</Test>
      </body>
    </html>
  );
}

interface TestProps {
  prop: number;
  children: string;
}

function Test({ prop, children }: TestProps): JSX.Element {
  const [clicks, setClicks] = useState(0);

  function handleClick() {
    setClicks(clicks() + 1);
  }

  function nextClick(): number {
    return clicks() + 1;
  }

  const fallback = <span>Less then 5</span>;

  return (
    <footer class="test">
      <button onclick={handleClick}>test child {clicks}</button>
      <div>Clicks: {clicks}</div>
      <div>Next click: {nextClick}</div>
      <Show when={() => clicks() > 5} fallback={fallback}>
        More than 5 clicks
      </Show>
      <div>
        test child {prop} {children}
      </div>
    </footer>
  );
}
