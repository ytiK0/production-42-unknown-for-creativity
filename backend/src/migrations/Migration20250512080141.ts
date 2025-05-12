import { Migration } from '@mikro-orm/migrations';

export class Migration20250512080141 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "outfit" ("outfit_slug" varchar(255) not null, "outfit_name" varchar(255) not null, "description" text not null, "created_at" timestamptz not null, "user_username" varchar(255) not null, constraint "outfit_pkey" primary key ("outfit_slug"));`);

    this.addSql(`alter table "outfit" add constraint "outfit_user_username_foreign" foreign key ("user_username") references "user" ("username") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "outfit" cascade;`);
  }

}
