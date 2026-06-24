import { existsSync, renameSync } from 'node:fs';

export default async () => {
  if (existsSync('.env.temp')) {
    renameSync('.env.temp', '.env');
  }
};
