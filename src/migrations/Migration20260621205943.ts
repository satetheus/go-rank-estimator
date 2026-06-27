import { Migration } from "@mikro-orm/migrations";

export class Migration20260621205943 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "players" ("player_id" serial primary key, "created_timestamp" timestamp(6) null, "modified_timestamp" timestamp(6) null, "server" varchar null, "server_player_id" int null, "username" varchar null, "country" varchar null, "rating_version" int null, "rating" numeric(10,0) null, "deviation" numeric(10,0) null, "volatility" numeric(10,0) null, "ranking" numeric(10,0) null, "professional" boolean null);`,
    );

    this.addSql(
      `create table "games" ("game_id" serial primary key, "created_timestamp" timestamp(6) null, "modified_timestamp" timestamp(6) null, "server" varchar null, "server_game_id" int null, "black_player_id" int not null, "white_player_id" int not null, "winner" varchar null, "outcome" varchar null, "annulled" boolean null, "annulment_reason" varchar null, "finished_at" int null, "width" int null, "height" int null, "rules" varchar null, "ranked" boolean null, "white_total" numeric(10,0) null, "white_stones" numeric(10,0) null, "white_territory" numeric(10,0) null, "white_prisoners" numeric(10,0) null, "white_handicap" numeric(10,0) null, "white_komi" numeric(10,0) null, "black_total" numeric(10,0) null, "black_stones" numeric(10,0) null, "black_territory" numeric(10,0) null, "black_prisoners" numeric(10,0) null, "black_handicap" numeric(10,0) null, "black_komi" numeric(10,0) null, "time_control" varchar null, "main_time" int null, "periods" int null, "period_time" int null, "speed" varchar null);`,
    );

    this.addSql(
      `create table "moves" ("move_id" serial primary key, "player_id" int not null, "game_id" int not null, "move" varchar not null, "move_x" int null, "move_y" int null, "turnnumber" int not null, "currentcolor" varchar null, "rawlead" numeric(10,0) null, "rawnoresultprob" numeric(10,0) null, "rawscoreselfplay" numeric(10,0) null, "rawscoreselfplaystdev" numeric(10,0) null, "rawstscoreerror" numeric(10,0) null, "rawstwrerror" numeric(10,0) null, "rawvartimeleft" numeric(10,0) null, "rawwinrate" numeric(10,0) null, "scorelead" numeric(10,0) null, "scoreselfplay" numeric(10,0) null, "scorestdev" numeric(10,0) null, "utility" numeric(10,0) null, "visits" int null, "weight" numeric(10,0) null, "winrate" numeric(10,0) null);`,
    );

    this.addSql(
      `alter table "games" add constraint "games_black_player_id_foreign" foreign key ("black_player_id") references "players" ("player_id") on update no action on delete no action;`,
    );
    this.addSql(
      `alter table "games" add constraint "games_white_player_id_foreign" foreign key ("white_player_id") references "players" ("player_id") on update no action on delete no action;`,
    );

    this.addSql(
      `alter table "moves" add constraint "moves_player_id_foreign" foreign key ("player_id") references "players" ("player_id") on update no action on delete no action;`,
    );
    this.addSql(
      `alter table "moves" add constraint "moves_game_id_foreign" foreign key ("game_id") references "games" ("game_id") on update no action on delete no action;`,
    );
  }
}
