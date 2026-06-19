import { Collection, PrimaryKeyProp, defineEntity, p } from "@mikro-orm/core";
import { Games } from "./Games.js";
import { Moves } from "./Moves.js";

export class Players {
  [PrimaryKeyProp]?: "playerId";
  playerId!: number;
  createdTimestamp?: Date;
  modifiedTimestamp?: Date;
  server?: string;
  serverPlayerId?: number;
  username?: string;
  country?: string;
  ratingVersion?: number;
  rating?: string;
  deviation?: string;
  volatility?: string;
  ranking?: string;
  professional?: boolean;
  gamesAsBlack = new Collection<Games>(this);
  gamesAsWhite = new Collection<Games>(this);
  movesCollection = new Collection<Moves>(this);
}

export const PlayersSchema = defineEntity({
  class: Players,
  properties: {
    playerId: p.integer().primary(),
    createdTimestamp: p.datetime().columnType("timestamp(6)").nullable(),
    modifiedTimestamp: p.datetime().columnType("timestamp(6)").nullable(),
    server: p.string().length(-1).nullable(),
    serverPlayerId: p.integer().nullable(),
    username: p.string().length(-1).nullable(),
    country: p.string().length(-1).nullable(),
    ratingVersion: p.integer().nullable(),
    rating: p.decimal().nullable(),
    deviation: p.decimal().nullable(),
    volatility: p.decimal().nullable(),
    ranking: p.decimal().nullable(),
    professional: p.boolean().nullable(),
    gamesAsBlack: () => p.oneToMany(Games).mappedBy("black"),
    gamesAsWhite: () => p.oneToMany(Games).mappedBy("white"),
    movesCollection: () => p.oneToMany(Moves).mappedBy("player"),
  },
});
