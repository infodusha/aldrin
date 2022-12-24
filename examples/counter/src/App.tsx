import { createSharedState, useEffect, useSharedState } from "aldrin";
import { Layout } from "./Layout";

const counter = createSharedState(0);

export async function App(): JSX.AsyncElement {
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
    </Layout>
  );
}
