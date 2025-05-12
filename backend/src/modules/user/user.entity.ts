import {Entity, PrimaryKey, Property} from "@mikro-orm/postgresql";
import bcrypt from "bcryptjs"
import {UserRepository} from "./user.repository.js";

@Entity({repository: () => UserRepository})
export class User {
  @PrimaryKey()
  username: string;

  @Property({ hidden: true, lazy: true })
  passwordHash!: string;

  @Property({persist: false})
  token!: string;

  constructor(username: string, passwordHash: string) {
    this.username = username;
    this.passwordHash = passwordHash;
  }

  async verifyPassword(password: string) {
    return await bcrypt.compare(password, this.passwordHash);
  }
}