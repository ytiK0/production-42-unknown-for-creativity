import { defineConfig } from "@mikro-orm/sqlite";
import {User} from "./modules/user/user.entity.js";
import {TsMorphMetadataProvider} from "@mikro-orm/reflection";

export default defineConfig({
  dbName: ":memory:",
  metadataProvider: TsMorphMetadataProvider,
  entities: [User]
})