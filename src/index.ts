import fetch from "node-fetch";
import { MikroORM } from "@mikro-orm/postgresql";
import config from "./mikro-orm.config";
import { Players } from "./entities/Players";
import { Game, Move } from "./types";
import { extractPlayerFromGame } from "./DBFunctions";

const getGame = async (gameId: number) => {
  const apiURL = `https://online-go.com/api/v1/games/${gameId}/`;
  const response = await fetch(apiURL);
  return (await response.json()) as Game;
};

const formatMoves = (
  moves: Move[],
  handicap: number,
  freeHandicapPlacement: boolean,
  boardSize: number,
) => {
  let blackPlays = true;

  if (handicap > 1 && !freeHandicapPlacement) {
    blackPlays = false;
  }

  const BOARD_COORD = "ABCDEFGHJKLMNOPQRST";

  const formattedMoves: string[][] = [];
  moves.forEach((move: Move) => {
    if (move[0] < 0) {
      blackPlays = !blackPlays;
      return;
    }
    formattedMoves.push([
      blackPlays ? "B" : "W",
      `${BOARD_COORD[move[0]]}${boardSize - move[1]}`,
    ]);
    blackPlays = !blackPlays;
  });

  return formattedMoves;
};

const writeGame = (game: Game) => {
  return {
    id: game.id,
    moves: formatMoves(
      game.gamedata.moves,
      game.handicap,
      game.gamedata.free_handicap_placement,
      game.height,
    ),
    rules: game.rules,
    komi: game.komi,
    boardXSize: game.width,
    boardYSize: game.height,
    analyzeTurns: [],
  };
};

const orm = await MikroORM.init(config);
// em = Entity Manager
const em = orm.em.fork();

const game = await getGame(2);

const existingPlayerWhite = await em.findOne(Players, {
  serverPlayerId: game.players.white.id,
});
if (!existingPlayerWhite) {
  em.create(Players, extractPlayerFromGame(game, false));
}

const existingPlayerBlack = await em.findOne(Players, {
  serverPlayerId: game.players.black.id,
});
if (!existingPlayerBlack) {
  em.create(Players, extractPlayerFromGame(game, true));
}

await em.flush();

writeGame(game);
console.log(game);

export {};
