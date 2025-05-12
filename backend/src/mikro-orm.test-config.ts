import { defineConfig } from "@mikro-orm/sqlite";
import {TsMorphMetadataProvider} from "@mikro-orm/reflection";
import config from "./mikro-orm.config.js";

export default defineConfig({
  dbName: ":memory:",
  metadataProvider: TsMorphMetadataProvider,
  entities: config.entities
})