import { useState } from "aldrin";

export function App(): JSX.Element {
  const [clicks, setClicks] = useState(0);

  function handleClick() {
    setClicks(clicks() + 1);
  }

  return (
    <html>
      <body>
        <button onclick={handleClick}>Click me</button>
        <div>Clicks: {clicks}</div>
      </body>
    </html>
  );
}
