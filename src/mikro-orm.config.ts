import { defineConfig } from "@mikro-orm/postgresql";
import { EntityGenerator } from "@mikro-orm/entity-generator";
import { Players } from "./entities/Players";
import { Moves } from "./entities/Moves";
import { Games } from "./entities/Games";

export default defineConfig({
  host: "localhost",
  port: parseInt(process.env.DB_PORT ? process.env.DB_PORT : "5433"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: "go_stats",

  entities: [Games, Moves, Players],
  extensions: [EntityGenerator],
});
