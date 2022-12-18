import { useState, useWatch } from "aldrin";
import { Layout } from "./Layout";
import * as console from "console";

let counter = 0;

export function App(): JSX.Element {
  const [clicks, setClicks] = useState(counter);

  useWatch(() => {
    console.log(clicks());
  }, [clicks]);

  function handleClick() {
    counter++;
    setClicks(counter);
  }

  return (
    <Layout>
      <button onclick={handleClick}>Click me</button>
      <div>Clicks: {clicks}</div>
    </Layout>
  );
}
