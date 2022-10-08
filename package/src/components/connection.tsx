import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { config } from '../config';

const script = readFileSync(join(__dirname, '../../script.js'), 'utf-8');

export function Connection(): JSX.Element {
  const vars = `
    const port = ${config.port};
  `;

  return (
    <script>
      {vars}
      {script}
    </script>
  );
}
