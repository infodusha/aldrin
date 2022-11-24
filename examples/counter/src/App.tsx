import { useState } from "aldrin";
import { Layout } from "./Layout";

let counter = 0;

export function App(): JSX.Element {
  const [clicks, setClicks] = useState(() => counter);

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
