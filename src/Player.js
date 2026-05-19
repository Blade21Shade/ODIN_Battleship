export default class Player {
    playerBoard;

    constructor(playerBoard) {
        this.playerBoard = playerBoard;
    }

    setPlayerBoard(board) {
        this.playerBoard = board;
    }
}