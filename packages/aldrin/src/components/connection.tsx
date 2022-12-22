import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { config } from '../config';
import { render, unsafe } from '../render/';

const script = readFileSync(join(__dirname, '../../script.js'), 'utf-8');

function buildVars(vars: Record<string, unknown>): string {
  return Object.entries(vars)
    .map(([key, value]) => `const ${key} = ${JSON.stringify(value)};`)
    .join('\n');
}

export function Connection(): JSX.Element {
  const vars = buildVars({
    port: config.port,
  });

  return (
    <script type="module">
      {unsafe(vars)}
      {unsafe(script)}
    </script>
  );
}

let connectionStr = '';
export function getConnectionStr(): string {
  return connectionStr;
}

export async function setConnectionStr(): Promise<void> {
  connectionStr = await render(Connection());
}
