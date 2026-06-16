import fetch from 'node-fetch'

const getGame = async (gameId: number) => {
    const apiURL = `https://online-go.com/api/v1/games/${gameId}/`
    const response = await fetch(apiURL)
    return await response.json()
}

const formatMoves = (moves: any, handicap: any) => {
    let blackPlays = true
    if (parseInt(handicap) > 1) {
        blackPlays = false
    }

    const BOARD_COORD = 'ABCDEFGHJKLMNOPQRST'

    const formattedMoves: string[][] = []
    moves.forEach((move: number[]) => {
        if (move[0] < 0) {
            blackPlays = !blackPlays
            return
        }
        formattedMoves.push([blackPlays ? 'B' : 'W', `${BOARD_COORD[move[0]]}${move[1]+1}`])
        blackPlays = !blackPlays
    })

    return formattedMoves

}

const writeGame = (game: any) => {
    const formattedGame = {
        id: game.id,
        moves: formatMoves(game.gamedata.moves, game.hanicap),
        rules: game.rules,
        komi: game.komi,
        boardXSize: game.width,
        boardYSize: game.height,
        analyzeTurns: [],
    }
    console.log(formattedGame)
    return formattedGame

}

const blah = await getGame(2)
writeGame(blah)
console.log(blah)

export {}
