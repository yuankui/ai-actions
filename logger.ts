import type { Logger } from './types.ts';

export function createLogger(): Logger {
  return {
    log: (message: string) => console.log(message),
    error: (message: string) => console.error(message)
  };
}
