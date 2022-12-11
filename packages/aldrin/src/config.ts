import { readFileSync } from 'node:fs';
import { join } from 'node:path';

class Config {
  readonly port: number = 8089;
  readonly connectionTimeoutMs: number = 30000;

  static withDefaults(source: Config): Config {
    const defaults = new Config();

    const handler: ProxyHandler<Config> = {
      get(target, prop: keyof Config) {
        return target[prop] ?? defaults[prop];
      },
    };

    try {
      return new Proxy(source, handler);
    } catch {
      throw new Error('Unable to read config: invalid format (not an object)');
    }
  }

  static fromString(content: string): Config {
    let source: Config;
    try {
      source = JSON.parse(content);
    } catch {
      throw new Error('Unable to read config: invalid format (not a JSON)');
    }

    return Config.withDefaults(source);
  }

  static fromFile(path: string): Config {
    let content: string;
    try {
      content = readFileSync(join(process.cwd(), path), 'utf8');
    } catch {
      return new Config();
    }
    return Config.fromString(content);
  }
}
export const config: Config = Config.fromFile('.aldrinrc');
