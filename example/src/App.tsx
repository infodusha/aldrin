import { useMount, useState } from "aldrin";

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
        {/*<Show when={clicks() > 5}>More than 5 clicks</Show>*/}
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
    console.log("click " + clicks());
    setClicks(clicks() + 1);
  }

  return (
    <footer class="test">
      <button onclick={handleClick}>test child 1</button>
      <div>Clicks: {clicks()}</div>
      <div>
        test child {prop} {children}
      </div>
    </footer>
  );
}
