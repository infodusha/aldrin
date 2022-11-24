import { readFileSync } from 'node:fs';
import { join } from 'node:path';

class Config {
  readonly port: number = 8089;
  readonly connectionTimeoutMs: number = 30000;
}

const defaults = new Config();

const handler: ProxyHandler<Config> = {
  get(target, prop: keyof Config) {
    return target[prop] ?? defaults[prop];
  },
};

const content = readFileSync(join(process.cwd(), '/.aldrinrc'), 'utf8');
const source: Config = JSON.parse(content);

export const config: Config = new Proxy(source, handler);
