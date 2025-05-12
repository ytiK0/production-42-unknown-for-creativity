import { Migration } from '@mikro-orm/migrations';

export class Migration20250511133646 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("username" varchar(255) not null, "user_pic_href" varchar(255) null, "password_hash" varchar(255) not null, constraint "user_pkey" primary key ("username"));`);
  }

}
