import { useEffect, useState } from "aldrin";
import { Layout } from "./Layout";

let counter = 0;

export async function App(): JSX.AsyncElement {
  const [clicks, setClicks] = useState(counter);

  useEffect(() => {
    console.log(clicks());
  });

  function handleClick() {
    counter++;
    setClicks(counter);
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
