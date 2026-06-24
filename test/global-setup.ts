import { existsSync, renameSync } from 'node:fs';

export default async () => {
  if (existsSync('.env')) {
    renameSync('.env', '.env.temp');
  }
};
