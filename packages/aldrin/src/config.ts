import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface Config {
  port: number;
}

const content = readFileSync(join(process.cwd(), '/.aldrinrc'), 'utf8');

export const config: Config = JSON.parse(content);
