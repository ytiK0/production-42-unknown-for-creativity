import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/postgresql";
import {User} from "../user/user.entity.js";

@Entity()
export class Outfit {
  @PrimaryKey()
  outfitSlug!: string

  @Property()
  outfitName!: string;

  @Property({ columnType: "text" })
  description!: string

  @Property()
  createdAt: Date = new Date();

  @ManyToOne()
  user!: User;
}