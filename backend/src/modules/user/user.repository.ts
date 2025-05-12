import {EntityRepository} from "@mikro-orm/postgresql";
import {User} from "./user.entity.js";

export class UserRepository extends EntityRepository<User> {
  async isExist(username: string) {
    const user = await this.findOne({ username });
    return user !== null;
  }

  async login(username: string, password: string) {
    const user = await this.findOne({username}, {populate: ["passwordHash"]});

    return await user!.verifyPassword(password);
  }
}