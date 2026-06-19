import { Game } from "./types";
import { Players } from "./entities/Players";
import { RequiredEntityData } from "@mikro-orm/postgresql";

export const extractPlayerFromGame = (game: Game, extractBlack: boolean) => {
  const playerToExtract = extractBlack
    ? game.players.black
    : game.players.white;
  const PlayerEntity: RequiredEntityData<Players> = {
    createdTimestamp: new Date(),
    modifiedTimestamp: new Date(),
    server: "OGS",
    serverPlayerId: playerToExtract.id,
    username: playerToExtract.username,
    country: playerToExtract.country,
    ratingVersion: playerToExtract.ratings.version,
    rating: playerToExtract.ratings.overall.rating.toString(),
    deviation: playerToExtract.ratings.overall.deviation.toString(),
    volatility: playerToExtract.ratings.overall.volatility.toString(),
    ranking: playerToExtract.ranking.toString(),
    professional: playerToExtract.professional,
  };
  return PlayerEntity;
};
