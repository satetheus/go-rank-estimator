import fetch from "node-fetch";
import { MikroORM } from "@mikro-orm/postgresql";
import config from "./mikro-orm.config";
import { Players } from "./entities/Players";
import { AnalyzedMove, Game, Move } from "./types";
import { extractPlayerFromGame } from "./DBFunctions";
import { shrinkJSON, stringify } from "json-shrinker";
import { spawn } from "child_process";
import * as readline from "node:readline";
import { Games } from "./entities/Games";
import { Moves } from "./entities/Moves";

const orm = await MikroORM.init(config);
// em = Entity Manager
const em = orm.em.fork();

const BOARD_COORD = "ABCDEFGHJKLMNOPQRST";

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

const formatGameJson = (game: Game) => {
  const formattedMoves = formatMoves(
    game.gamedata.moves,
    game.handicap,
    game.gamedata.free_handicap_placement,
    game.height,
  );
  return {
    id: game.id.toString(),
    moves: formattedMoves,
    rules: game.rules,
    komi: parseFloat(game.komi),
    boardXSize: game.width,
    boardYSize: game.height,
    analyzeTurns: formattedMoves.map((_move: string[], i) => i),
  };
};

const writePlayersIfMissing = async (game: Game) => {
  let existingPlayerWhite = await em.findOne(Players, {
    serverPlayerId: game.players.white.id,
  });
  if (!existingPlayerWhite) {
    existingPlayerWhite = em.create(
      Players,
      extractPlayerFromGame(game, false),
    );
  }

  let existingPlayerBlack = await em.findOne(Players, {
    serverPlayerId: game.players.black.id,
  });
  if (!existingPlayerBlack) {
    existingPlayerBlack = em.create(Players, extractPlayerFromGame(game, true));
  }

  await em.flush();

  return {
    blackPlayer: existingPlayerBlack as Players,
    whitePlayer: existingPlayerWhite as Players,
  };
};

const writeGameIfMissing = async (
  game: Game,
  blackPlayer: Players,
  whitePlayer: Players,
) => {
  const existingGame = await em.findOne(Games, {
    serverGameId: game.id,
    server: "OGS",
  });
  if (existingGame) {
    return existingGame;
  }

  const gameEntity = em.create(Games, {
    serverGameId: game.id,
    black: blackPlayer,
    white: whitePlayer,
    createdTimestamp: new Date(),
    modifiedTimestamp: new Date(),
    server: "OGS",
    winner: game.white_lost ? "BLACK" : "WHITE",
    outcome: game.outcome,
    annulled: game.annulled,
    annulmentReason: game.annulment_reason?.handicap_out_of_range
      ? "Handicap Out Of Range"
      : null,
    finishedAt: new Date(game.ended).getTime(),
    width: game.width,
    height: game.height,
    rules: game.rules,
    ranked: game.ranked,
    whiteTotal: game.gamedata.score.white.total.toString(),
    whiteStones: game.gamedata.score.white.stones.toString(),
    whiteTerritory: game.gamedata.score.white.territory.toString(),
    whitePrisoners: game.gamedata.score.white.prisoners.toString(),
    whiteHandicap: game.gamedata.score.white.handicap.toString(),
    whiteKomi: game.gamedata.score.white.komi.toString(),
    blackTotal: game.gamedata.score.black.total.toString(),
    blackStones: game.gamedata.score.black.stones.toString(),
    blackTerritory: game.gamedata.score.black.territory.toString(),
    blackPrisoners: game.gamedata.score.black.prisoners.toString(),
    blackHandicap: game.gamedata.score.black.handicap.toString(),
    blackKomi: game.gamedata.score.black.komi.toString(),
    timeControl: game.time_control,
    mainTime: game.gamedata.time_control.main_time,
    periods: game.gamedata.time_control.periods,
    periodTime: game.gamedata.time_control.period_time,
    speed: game.gamedata.time_control.speed,
  });

  await em.flush();
  return gameEntity;
};

const main = async () => {
  const game = await getGame(84536377);

  const {
    blackPlayer,
    whitePlayer,
  }: { blackPlayer: Players; whitePlayer: Players } =
    await writePlayersIfMissing(game);

  // TODO should add a check if the game exists and exit unless some flag is passed in to override

  const gameEntity = await writeGameIfMissing(game, blackPlayer, whitePlayer);

  const gameObj = formatGameJson(game);
  const formattedGameStr = shrinkJSON(stringify(gameObj));

  // Call katago
  const katagoProcess = spawn("../katago/katago", [
    "analysis",
    "-config",
    "../katago/config2.cfg",
    "-model",
    "../katago/kata1-zhizi-b40c768nbt-fdx6c.bin.gz",
  ]);

  katagoProcess.on("error", (err) => console.error("spawn failed:", err));

  // Print to output
  // Comment out for silent run
  katagoProcess.stderr.pipe(process.stderr);

  // Parse stdout line-by-line, printing each result as it completes:
  const rl = readline.createInterface({ input: katagoProcess.stdout });
  rl.on("line", (line) => {
    if (!line.trim()) return;
    const analyzedMove: AnalyzedMove = JSON.parse(line);
    console.log(analyzedMove);
    em.create(Moves, {
      player:
        analyzedMove.rootInfo.currentPlayer === "B" ? blackPlayer : whitePlayer,
      game: gameEntity,
      move: gameObj.moves[analyzedMove.turnNumber][1],
      moveX: BOARD_COORD.indexOf(
        gameObj.moves[analyzedMove.turnNumber][1].slice(0, 1),
      ),
      moveY: parseInt(gameObj.moves[analyzedMove.turnNumber][1].slice(1)),
      turnnumber: analyzedMove.turnNumber,
      currentcolor: analyzedMove.rootInfo.currentPlayer,
      rawlead: analyzedMove.rootInfo.rawLead,
      rawnoresultprob: analyzedMove.rootInfo.rawNoResultProb,
      rawscoreselfplay: analyzedMove.rootInfo.rawScoreSelfplay,
      rawscoreselfplaystdev: analyzedMove.rootInfo.rawScoreSelfplayStdev,
      rawstscoreerror: analyzedMove.rootInfo.rawStScoreError,
      rawstwrerror: analyzedMove.rootInfo.rawStWrError,
      rawvartimeleft: analyzedMove.rootInfo.rawVarTimeLeft,
      rawwinrate: analyzedMove.rootInfo.rawWinrate,
      scorelead: analyzedMove.rootInfo.scoreLead,
      scoreselfplay: analyzedMove.rootInfo.scoreSelfplay,
      scorestdev: analyzedMove.rootInfo.scoreStdev,
      utility: analyzedMove.rootInfo.utility,
      visits: analyzedMove.rootInfo.visits,
      weight: analyzedMove.rootInfo.weight,
      winrate: analyzedMove.rootInfo.winrate,
    });
  });

  katagoProcess.on("close", (_code) => {
    // TODO considering flushing after every creation
    // Possible that the process could be ended
    // May want to implement a flag that has us start analysis at a move number
    em.flush();
  });

  katagoProcess.stdin.write(formattedGameStr + "\n");
  katagoProcess.stdin.end();
};

await main();

export {};
