export interface Ratings {
  version: number;
  overall: {
    rating: number;
    deviation: number;
    volatility: number;
  };
}

export interface Player {
  id: number;
  username: string;
  country: string;
  icon: string;
  ratings: Ratings;
  ranking: number;
  professional: boolean;
  ui_class: string;
}

export interface GameDataPlayer {
  username: string;
  elo: number;
  rank: number;
}

export type Move = [number, number, number];

export interface GameData {
  allow_ko: boolean;
  allow_self_capture: boolean;
  allow_superko: boolean;
  automatic_stone_removal: boolean;
  black_player_id: number;
  clock: {
    current_player: number;
    title: string;
    black_player_id: number;
    white_player_id: number;
    expiration: number;
    game_id: number;
    black_time: number;
    white_time: number;
  };
  free_handicap_placement: boolean;
  game_id: number;
  handicap: number;
  height: number;
  initial_player: string;
  initial_state: { black: string; white: string };
  komi: number;
  moves: Move[];
  opponent_plays_first_after_resume: boolean;
  outcome: string;
  pause_on_weekends: boolean;
  phase: string;
  players: { black: GameDataPlayer; white: GameDataPlayer };
  rules: string;
  score_passes: boolean;
  score_prisoners: boolean;
  score_stones: boolean;
  score_territory: boolean;
  score_territory_in_seki: boolean;
  superko_algorithm: string;
  time_control: {
    system: string;
    speed: string;
    per_move: number;
    pause_on_weekends: boolean;
  };
  white_must_pass_last: boolean;
  white_player_id: number;
  width: number;
  winner: number;
}

export interface Game {
  id: number;
  all_players: number[];
  name: string;
  players: { black: Player; white: Player };
  related: { reviews: string };
  creator: number;
  mode: string;
  source: string;
  black: number;
  white: number;
  width: number;
  height: number;
  rules: string;
  ranked: boolean;
  handicap: number;
  // TODO
  handicap_rank_difference?: any;
  komi: string;
  time_control: string;
  disable_analysis: boolean;
  tournament?: any;
  tournament_round: number;
  // TODO
  ladder?: any;
  pause_on_weekends: boolean;
  outcome: string;
  black_lost: boolean;
  white_lost: boolean;
  annulled: boolean;
  annulment_reason: { handicap_out_of_range: true };
  started: string;
  ended: string;
  historical_ratings: { black: Player; white: Player };
  gamedata: GameData;
  // TODO
  auth?: any;
  rengo: boolean;
  // TODO
  flags?: any;
  // TODO
  bot_detection_results?: any;
  // TODO
  simul_black?: any;
  // TODO
  simul_white?: any;
}
