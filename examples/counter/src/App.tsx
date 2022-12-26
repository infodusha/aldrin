import {
  createSharedState,
  Show,
  useEffect,
  useMount,
  useSharedState,
} from "aldrin";
import { Layout } from "./Layout";

const counter = createSharedState(0);

export function App(): JSX.Element {
  const [clicks, setClicks] = useSharedState(counter);

  useEffect(() => {
    console.log(clicks());
  });

  function handleClick() {
    setClicks(clicks() + 1);
  }

  function getTitle(): string {
    return `Go with ${clicks() + 1}`;
  }

  return (
    <Layout>
      <button onclick={handleClick} title={getTitle}>
        Click me
      </button>
      <div>Clicks: {clicks}</div>
      <Show when={() => clicks() >= 5 && clicks() <= 10}>
        <div>From 5 to 10 clicks</div>
        <Test />
      </Show>
    </Layout>
  );
}

function Test(): JSX.Element {
  useMount(() => {
    console.log("mounted");
    return () => {
      console.log("unmounted");
    };
  });
  return "test";
}
