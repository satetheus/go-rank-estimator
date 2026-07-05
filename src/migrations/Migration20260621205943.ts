import { Migration } from "@mikro-orm/migrations";

export class Migration20260621205943 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "players" ("player_id" serial primary key, "created_timestamp" timestamp(6) null, "modified_timestamp" timestamp(6) null, "server" varchar null, "server_player_id" int null, "username" varchar null, "country" varchar null, "rating_version" int null, "rating" numeric null, "deviation" numeric null, "volatility" numeric null, "ranking" numeric null, "professional" boolean null);`,
    );

    this.addSql(
      `create table "games" ("game_id" serial primary key, "created_timestamp" timestamp(6) null, "modified_timestamp" timestamp(6) null, "server" varchar null, "server_game_id" int null, "black_player_id" int not null, "white_player_id" int not null, "winner" varchar null, "outcome" varchar null, "annulled" boolean null, "annulment_reason" varchar null, "finished_at" int null, "width" int null, "height" int null, "rules" varchar null, "ranked" boolean null, "white_total" numeric null, "white_stones" numeric null, "white_territory" numeric null, "white_prisoners" numeric null, "white_handicap" numeric null, "white_komi" numeric null, "black_total" numeric null, "black_stones" numeric null, "black_territory" numeric null, "black_prisoners" numeric null, "black_handicap" numeric null, "black_komi" numeric null, "time_control" varchar null, "main_time" int null, "periods" int null, "period_time" int null, "speed" varchar null);`,
    );

    this.addSql(
      `create table "moves" ("move_id" serial primary key, "player_id" int not null, "game_id" int not null, "move" varchar not null, "move_x" int null, "move_y" int null, "turnnumber" int not null, "currentcolor" varchar null, "rawlead" numeric null, "rawnoresultprob" numeric null, "rawscoreselfplay" numeric null, "rawscoreselfplaystdev" numeric null, "rawstscoreerror" numeric null, "rawstwrerror" numeric null, "rawvartimeleft" numeric null, "rawwinrate" numeric null, "scorelead" numeric null, "scoreselfplay" numeric null, "scorestdev" numeric null, "utility" numeric null, "visits" int null, "weight" numeric null, "winrate" numeric null);`,
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
