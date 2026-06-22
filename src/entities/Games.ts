import {
  Collection,
  PrimaryKeyProp,
  type Ref,
  defineEntity,
  p,
} from "@mikro-orm/core";
import { Moves } from "./Moves.js";
import { Players } from "./Players.js";

export class Games {
  [PrimaryKeyProp]?: "gameId";
  gameId!: number;
  createdTimestamp?: Date;
  modifiedTimestamp?: Date;
  server?: string;
  serverGameId?: number;
  black!: Ref<Players>;
  white!: Ref<Players>;
  winner?: string;
  outcome?: string;
  annulled?: boolean;
  annulmentReason?: string;
  finishedAt?: number;
  width?: number;
  height?: number;
  rules?: string;
  ranked?: boolean;
  whiteTotal?: string;
  whiteStones?: string;
  whiteTerritory?: string;
  whitePrisoners?: string;
  whiteHandicap?: string;
  whiteKomi?: string;
  blackTotal?: string;
  blackStones?: string;
  blackTerritory?: string;
  blackPrisoners?: string;
  blackHandicap?: string;
  blackKomi?: string;
  timeControl?: string;
  mainTime?: number;
  periods?: number;
  periodTime?: number;
  speed?: string;
  movesCollection = new Collection<Moves>(this);
}

export const GamesSchema = defineEntity({
  class: Games,
  properties: {
    gameId: p.integer().primary(),
    createdTimestamp: p.datetime().columnType("timestamp(6)").nullable(),
    modifiedTimestamp: p.datetime().columnType("timestamp(6)").nullable(),
    server: p.string().length(-1).nullable(),
    serverGameId: p.integer().nullable(),
    black: () =>
      p
        .manyToOne(Players)
        .ref()
        .updateRule("no action")
        .deleteRule("no action"),
    white: () =>
      p
        .manyToOne(Players)
        .ref()
        .updateRule("no action")
        .deleteRule("no action"),
    winner: p.string().length(-1).nullable(),
    outcome: p.string().length(-1).nullable(),
    annulled: p.boolean().nullable(),
    annulmentReason: p.string().length(-1).nullable(),
    finishedAt: p.integer().nullable(),
    width: p.integer().nullable(),
    height: p.integer().nullable(),
    rules: p.string().length(-1).nullable(),
    ranked: p.boolean().nullable(),
    whiteTotal: p.decimal().nullable(),
    whiteStones: p.decimal().nullable(),
    whiteTerritory: p.decimal().nullable(),
    whitePrisoners: p.decimal().nullable(),
    whiteHandicap: p.decimal().nullable(),
    whiteKomi: p.decimal().nullable(),
    blackTotal: p.decimal().nullable(),
    blackStones: p.decimal().nullable(),
    blackTerritory: p.decimal().nullable(),
    blackPrisoners: p.decimal().nullable(),
    blackHandicap: p.decimal().nullable(),
    blackKomi: p.decimal().nullable(),
    timeControl: p.string().length(-1).nullable(),
    mainTime: p.integer().nullable(),
    periods: p.integer().nullable(),
    periodTime: p.integer().nullable(),
    speed: p.string().length(-1).nullable(),
    movesCollection: () => p.oneToMany(Moves).mappedBy("game"),
  },
});
