import Ship from "./Ship.js"
import Gameboard from "./Gameboard.js"
import Player from "./Player.js"

let gameBoardSize;
let playerTurn; // Swaps between 1 and 2 to control game actions

let player1Board;
let player2Board;

let player1;
let player2;

function initializeGameState() {
    gameBoardSize = 10;
    playerTurn = 1;

    player1Board = new Gameboard(gameBoardSize);
    player2Board = new Gameboard(gameBoardSize);

    player1 = new Player(player1Board);
    player2 = new Player(player2Board);
}

function getGameBoardSize() {
    return gameBoardSize;
}

function getPlayerTurn() {
    return playerTurn;
}

function getPlayer1Board() {
    return player1Board;
}

function getPlayer2Board() {
    return player2Board;
}

function getPlayer1() {
    return player1;
}

function getPlayer2() {
    return player2;
}

function switchPlayerTurn() {
    playerTurn = playerTurn === 1 ? 2 : 1;
}

export {initializeGameState, getGameBoardSize, getPlayer1, getPlayer2, getPlayer1Board, getPlayer2Board, getPlayerTurn, switchPlayerTurn}