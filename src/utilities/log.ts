import { Console } from 'console';

import { ENV, ENVS } from '../configuration';

const logger = new Console(process.stdout, process.stderr);

export default function log(value: string, devOnly: boolean = false): void {
  if (ENV === ENVS.development || (ENV !== ENVS.development && !devOnly)) {
    logger.log(value);
  }
}
