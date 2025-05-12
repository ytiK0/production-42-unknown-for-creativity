import {UserRepository} from "./modules/user/user.repository.js";
import {EntityManager, EntityRepository, MikroORM as PgMikroOrm, Options} from "@mikro-orm/postgresql";
import {User} from "./modules/user/user.entity.js";
import config from "./mikro-orm.config.js"
import testConfig from "./mikro-orm.test-config.js";
import {MikroORM as TestMikroOrm} from "@mikro-orm/sqlite";
import {Outfit} from "./modules/outfit/outfit.entity.js";

export interface Services {
  orm: PgMikroOrm | TestMikroOrm;
  em: EntityManager;
  user: UserRepository;
  outfit: EntityRepository<Outfit>
}

let cache: Services;

const isTestEnv = process.env.NODE_ENV === "test"

export async function initORM(options?: Options): Promise<Services> {
  if (cache) {
    return cache;
  }

  let orm: TestMikroOrm | PgMikroOrm;

  if (isTestEnv) {
    orm = await TestMikroOrm.init({
      ...testConfig
    });
    await orm.schema.createSchema();
  }
  else {
    orm = await PgMikroOrm.init({
      ...config,
      ...options
    });
  }

  return cache = {
    orm,
    em: orm.em,
    user: orm.em.getRepository(User),
    outfit: orm.em.getRepository(Outfit)
  };
}