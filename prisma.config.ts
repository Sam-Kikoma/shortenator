import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { defineConfig } from 'prisma/config';

// Read the .env file and expand the variables immediately
expand(config());

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
