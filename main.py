import requests
import itertools
import json


def main(game_id):
    api_url = f"https://online-go.com/api/v1/games/{game_id}/"
    data = requests.get(api_url)
    try:
        with open(f"games/{game_id}.json", "x") as file:
            file.write(data.json())
    except FileExistsError:
        print(f"games/{game_id}.json already exists. Skipping...")

    write_formatted_data(data.json())

    return "Ok"


def write_formatted_data(game):
    input_data = {
        "id": str(game["id"]),
        "moves": format_moves(game["gamedata"]["moves"], game["handicap"]),
        "rules": game["rules"],
        "komi": round(float(game["komi"]), 1),
        "boardXSize": game["width"],
        "boardYSize": game["height"],
        "analyzeTurns": list(range(len(game["gamedata"]["moves"]))),
    }
    with open("to_analyze.json", "a") as file:
        file.write(json.dumps(input_data))

    return "Ok"


def format_moves(moves, handicap):
    order = ["B", "W"]
    if int(handicap) > 1:
        order.reverse()

    formatted_moves = []
    for move in moves:
        if move[0] <= 0:
            continue
        weird_but_works = ord("@") + 1 + move[0]
        if move[0] >= 8:
            weird_but_works += 1
        formatted_moves.append(f"{chr(weird_but_works)}{move[1]+1}")

    moves_with_player = list(zip(itertools.cycle(order), formatted_moves))

    return moves_with_player


if __name__ == "__main__":
    main(84357281)
