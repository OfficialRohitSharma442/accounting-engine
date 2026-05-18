import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  host: process.env.DATABASE_HOST,

  port: Number(process.env.DATABASE_PORT),

  user: process.env.DATABASE_USER,

  password: process.env.DATABASE_PASSWORD,

  dbName: process.env.DATABASE_NAME,

  entities: ['./dist/entities'],

  entitiesTs: ['./src/entities'],

  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },

  debug: true,
});
