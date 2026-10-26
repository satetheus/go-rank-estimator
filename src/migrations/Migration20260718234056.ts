import { Migration } from "@mikro-orm/migrations";

export class Migration20260718234056 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(`create view "move_deltas" as WITH all_deltas AS (
         SELECT moves.player_id,
            moves.currentcolor,
            moves.turnnumber,
            (moves.rawnoresultprob - lag(moves.rawnoresultprob) OVER (ORDER BY moves.game_id, moves.turnnumber)) AS rawnoresultprob_delta,
            (moves.scorelead - lag(moves.scorelead) OVER (ORDER BY moves.game_id, moves.turnnumber)) AS scorelead_delta,
            (moves.scoreselfplay - lag(moves.scoreselfplay) OVER (ORDER BY moves.game_id, moves.turnnumber)) AS scoreselfplay_delta,
            (moves.utility - lag(moves.utility) OVER (ORDER BY moves.game_id, moves.turnnumber)) AS utility_delta,
            (moves.winrate - lag(moves.winrate) OVER (ORDER BY moves.game_id, moves.turnnumber)) AS winrate_delta
           FROM moves
          ORDER BY moves.game_id, moves.turnnumber
        )
 SELECT player_id,
    turnnumber,
        CASE
            WHEN ((currentcolor)::text = 'W'::text) THEN (- rawnoresultprob_delta)
            ELSE rawnoresultprob_delta
        END AS rawnoresultprob_delta,
        CASE
            WHEN ((currentcolor)::text = 'W'::text) THEN (- scorelead_delta)
            ELSE scorelead_delta
        END AS scorelead_delta,
        CASE
            WHEN ((currentcolor)::text = 'W'::text) THEN (- scoreselfplay_delta)
            ELSE scoreselfplay_delta
        END AS scoreselfplay_delta,
        CASE
            WHEN ((currentcolor)::text = 'W'::text) THEN (- utility_delta)
            ELSE utility_delta
        END AS utility_delta,
        CASE
            WHEN ((currentcolor)::text = 'W'::text) THEN (- winrate_delta)
            ELSE winrate_delta
        END AS winrate_delta
   FROM all_deltas;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop view if exists "move_deltas" cascade;`);
  }
}
