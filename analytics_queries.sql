create view move_deltas as
    with all_deltas as (
        /* Window functions to get delta values */
        select
                player_id,
                currentcolor,
                turnnumber,
                rawnoresultprob - lag(rawnoresultprob) over (order by game_id, turnnumber) as rawnoresultprob_delta,
                scorelead - lag(scorelead) over (order by game_id, turnnumber) as scorelead_delta,
                scoreselfplay - lag(scoreselfplay) over (order by game_id, turnnumber) as scoreselfplay_delta,
                utility - lag(utility) over (order by game_id, turnnumber) as utility_delta,
                winrate - lag(winrate) over (order by game_id, turnnumber) as winrate_delta
        from moves
        order by game_id, turnnumber
    )
    /* This handles the negative values for white */
    select
            player_id,
            turnnumber,
            case
            when currentcolor = 'W' then
                    -rawnoresultprob_delta
            else
                    rawnoresultprob_delta
            end as rawnoresultprob_delta,
            case
            when currentcolor = 'W' then
                    -scorelead_delta
            else
                    scorelead_delta
            end as scorelead_delta,
            case
            when currentcolor = 'W' then
                    -scoreselfplay_delta
            else
                    scoreselfplay_delta
            end as scoreselfplay_delta,
            case
            when currentcolor = 'W' then
                    -utility_delta
            else
                    utility_delta
            end as utility_delta,
            case
            when currentcolor = 'W' then
                    -winrate_delta
            else
                    winrate_delta
            end as winrate_delta
    from all_deltas;


-- variation variable is just a factor for balancing the statistics
-- 400 means that a difference of 200 between ratings will be a 90%
-- chance of winning for the higher of the two.
create or replace function estimator(r1 decimal, r2 decimal, variation decimal default 400) returns float as $$
        begin
                return round((1+10^((r2-r1)/variation))^(-1),5);
        end;
$$ Language plpgsql;

-- try to run elo style calclulations on winrate deltas
with winrate_agg as (
        select move_deltas.player_id player,
               round(rating,2) rating,
               round(avg(winrate_delta),4) mean,
               round(min(winrate_delta),4) minimum,
               round(max(winrate_delta),4) maximum
        from move_deltas
        join players
          on players.player_id = move_deltas.player_id
        group by 1, 2
        order by mean desc
),
win as (
        select black_player_id,
               white_player_id,
               case when winner like 'WHITE'
                   then 0
               when winner like 'BLACK'
                   then 1
               end as result
        from games
),
pred as (
        select p1.player player1,
               p2.player player2,
               estimator(p1.rating, p2.rating) rating_est,
               -- 0.024414062 is a number found from binary search of variance values
               estimator(p1.mean, p2.mean, 0.024414062) wr_mean_est,
               estimator(p1.minimum, p2.minimum, 0.024414062) wr_minimum_est,
               estimator(p1.maximum, p2.maximum, 0.024414062) wr_maximum_est
        from winrate_agg p1
        join winrate_agg p2
          on p1.player != p2.player
)
select pred.player1,
       pred.player2,
       result,
       rating_est,
       wr_mean_est,
       wr_minimum_est,
       wr_maximum_est 
from pred
inner join win
  on black_player_id = player1
  and white_player_id = player2;

