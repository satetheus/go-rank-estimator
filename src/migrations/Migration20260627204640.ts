import { Migration } from "@mikro-orm/migrations";

export class Migration20260627204640 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `alter table "games" alter column "finished_at" type bigint using ("finished_at"::bigint);`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "games" alter column "finished_at" type int4 using ("finished_at"::int4);`,
    );
  }
}
