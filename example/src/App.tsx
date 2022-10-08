import { Connection, useMount } from "aldrin";

export function App(): JSX.Element {
  function handleClick() {
    console.log("click");
  }

  useMount(() => {
    console.log("mount");
    return () => {
      console.log("unmount");
    };
  });

  return (
    <div class="app">
      <Connection />
      <button onclick={handleClick}>test child 1</button>
      <Test prop={2}>children</Test>
      <br />
      <footer class="test">
        <div>test child {11}</div>
      </footer>
      <>
        <div>test child 3</div>
        <div>test child 4</div>
      </>
    </div>
  );
}

interface TestProps {
  prop: number;
  children: string;
}

function Test({ prop, children }: TestProps): JSX.Element {
  return (
    <footer class="test">
      <div>
        test child {prop} {children}
      </div>
    </footer>
  );
}
