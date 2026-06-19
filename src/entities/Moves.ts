import { PrimaryKeyProp, type Ref, defineEntity, p } from "@mikro-orm/core";
import { Games } from "./Games.js";
import { Players } from "./Players.js";

export class Moves {
  [PrimaryKeyProp]?: "moveId";
  moveId!: number;
  player!: Ref<Players>;
  game!: Ref<Games>;
  move!: string;
  moveX?: number;
  moveY?: number;
  turnnumber!: number;
  currentcolor?: string;
  rawlead?: string;
  rawnoresultprob?: string;
  rawscoreselfplay?: string;
  rawscoreselfplaystdev?: string;
  rawstscoreerror?: string;
  rawstwrerror?: string;
  rawvartimeleft?: string;
  rawwinrate?: string;
  scorelead?: string;
  scoreselfplay?: string;
  scorestdev?: string;
  utility?: string;
  visits?: number;
  weight?: string;
  winrate?: string;
}

export const MovesSchema = defineEntity({
  class: Moves,
  properties: {
    moveId: p.integer().primary(),
    player: () =>
      p
        .manyToOne(Players)
        .ref()
        .name("player_id")
        .updateRule("no action")
        .deleteRule("no action"),
    game: () =>
      p
        .manyToOne(Games)
        .ref()
        .name("game_id")
        .updateRule("no action")
        .deleteRule("no action"),
    move: p.string().length(-1),
    moveX: p.integer().nullable(),
    moveY: p.integer().nullable(),
    turnnumber: p.integer(),
    currentcolor: p.string().length(-1).nullable(),
    rawlead: p.decimal().nullable(),
    rawnoresultprob: p.decimal().nullable(),
    rawscoreselfplay: p.decimal().nullable(),
    rawscoreselfplaystdev: p.decimal().nullable(),
    rawstscoreerror: p.decimal().nullable(),
    rawstwrerror: p.decimal().nullable(),
    rawvartimeleft: p.decimal().nullable(),
    rawwinrate: p.decimal().nullable(),
    scorelead: p.decimal().nullable(),
    scoreselfplay: p.decimal().nullable(),
    scorestdev: p.decimal().nullable(),
    utility: p.decimal().nullable(),
    visits: p.integer().nullable(),
    weight: p.decimal().nullable(),
    winrate: p.decimal().nullable(),
  },
});
