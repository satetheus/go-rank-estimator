import { defineConfig } from "@mikro-orm/postgresql";
import { EntityGenerator } from "@mikro-orm/entity-generator";
import { Migrator } from "@mikro-orm/migrations";
import { Players } from "./entities/Players";
import { Moves } from "./entities/Moves";
import { Games } from "./entities/Games";

export default defineConfig({
  host: "localhost",
  port: parseInt(process.env.DB_PORT ? process.env.DB_PORT : "5332"),
  user: process.env.DB_USER ? process.env.DB_USER : "admin",
  password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "admin",
  dbName: "go_stats",

  entities: [Games, Moves, Players],
  extensions: [EntityGenerator, Migrator],
});
