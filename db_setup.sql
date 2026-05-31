create user chris;
create user sev;

create database go_stats;

\c go_stats;
grant connect, create on database go_stats to chris;
grant usage, create on schema public to chris;
grant select, insert, update, delete on all tables in schema public to chris;
grant usage, select on all sequences in schema public to chris;
alter default privileges in schema public
        grant select, insert, update, delete on tables to chris;
alter default privileges in schema public
        grant usage, select on sequences to chris;

grant connect, create on database go_stats to sev;
grant usage, create on schema public to sev;
grant select, insert, update, delete on all tables in schema public to sev;
grant usage, select on all sequences in schema public to sev;
alter default privileges in schema public
        grant select, insert, update, delete on tables to sev;
alter default privileges in schema public
        grant usage, select on sequences to sev;

create table players (
        player_id serial primary key,
        created_timestamp timestamp,
        modified_timestamp timestamp,
        server varchar,
        server_player_id integer,
        username varchar,
        country varchar,
        rating_version integer,
        rating decimal,
        deviation decimal,
        volatility decimal,
        ranking decimal,
        professional bool
);

create table games (
        game_id serial primary key,
        created_timestamp timestamp,
        modified_timestamp timestamp,
        server varchar,
        server_game_id integer,
        black_player_id integer not null references players,
        white_player_id integer not null references players,
        winner varchar,
        outcome varchar,
        annulled bool,
        annulment_reason varchar,
        finished_at integer,
        width integer,
        height integer,
        rules varchar,
        ranked bool,
        white_total decimal,
        white_stones decimal,
        white_territory decimal,
        white_prisoners decimal,
        white_handicap decimal,
        white_komi decimal,
        black_total decimal,
        black_stones decimal,
        black_territory decimal,
        black_prisoners decimal,
        black_handicap decimal,
        black_komi decimal,
        time_control varchar,
        main_time integer,
        periods integer,
        period_time integer,
        speed varchar,
        foreign key(black_player_id) references players (player_id),
        foreign key(white_player_id) references players (player_id)
);

create table moves (
        player_id integer not null references players,
        game_id integer not null references games,
        move varchar not null,
        move_x integer,
        move_y integer,
        turnNumber integer not null,
        currentColor varchar,
        rawLead decimal,
        rawNoResultProb decimal,
        rawScoreSelfplay decimal,
        rawScoreSelfplayStdev decimal,
        rawStScoreError decimal,
        rawStWrError decimal,
        rawVarTimeLeft decimal,
        rawWinrate decimal,
        scoreLead decimal,
        scoreSelfplay decimal,
        scoreStdev decimal,
        utility decimal,
        visits integer,
        weight decimal,
        winrate decimal,
        foreign key(player_id) references players (player_id),
        foreign key(game_id) references games (game_id)
);

create index black_player on games (black_player_id);
create index white_player on games (white_player_id);
create index move_player on moves (player_id);
create index move_game on moves (game_id);
