import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import {configDotenv} from "dotenv";
import {User} from "./modules/user/user.entity.js";
import {Migrator} from "@mikro-orm/migrations";

configDotenv({
  path: [".env.local", ".env"]
});

export default defineConfig({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  debug: process.env.NODE_ENV !== 'prod',
  metadataProvider: TsMorphMetadataProvider,
  entities: [User],
  dynamicImportProvider: id => import(id),
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
  extensions: [Migrator]
});
