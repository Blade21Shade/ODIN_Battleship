import GameBoard from "./GameBoard.js"
import Player from "./Player.js"
import Ship from "./Ship.js"

/**
 * @type {Number}
 */
let gameBoardSize; // The size of the game board in both the vertical and horizontal direction, this is used to create a square

/**
 * @type {Number}
 */
let playerTurn; // Swaps between 1 and 2 to control game actions

/**
 * @type {Boolean}
 */
let shotTakenThisTurn; // Tracks whether a user has taken their shot this turn

/**
 * @type {GameBoard}
 */
let boardToShootAt; // The board the current player will shoot at (player 1 shoots at board 2 and vice versa)

/**
 * @type {GameBoard}
 */
let player1Board, player2Board;

/**
 * @type {Player}
 */
let player1, player2;

/**
 * Sets each variable to the initial state needed for gameplay to begin
 */
function initializeGameState() {
    gameBoardSize = 10;
    playerTurn = 1;
    shotTakenThisTurn = false;

    player1Board = new GameBoard(gameBoardSize);
    player2Board = new GameBoard(gameBoardSize);

    boardToShootAt = player2Board;

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

function getBoardToShootAt() {
    return boardToShootAt;
}

function getShotTakenThisTurn() {
    return shotTakenThisTurn;
}

function switchPlayerTurn() {
    playerTurn = playerTurn === 1 ? 2 : 1;
}

/**
 * Switches the current player and the board to shoot to the opponent's state
 */
function switchCurrentPlayerState() {
    if (playerTurn === 1) {
        playerTurn = 2;
        boardToShootAt = player1Board;
    } else {
        playerTurn = 1;
        boardToShootAt = player2Board;
    }
}

/**
 * Resets the player turn and board to shoot at to the base values
 */
function resetPlayerState() {
    playerTurn = 1;
    boardToShootAt = player2Board;
}

/**
 * @param {Boolean} taken Must be true or false
 */
function setShotTakenThisTurn(taken) {
    if (taken === true || taken === false) { // Ensure this is only setting a boolean
        shotTakenThisTurn = taken;
    }   
}

/**
 * Gets arrays holding the 'friend' board's ship positions and shots, as well as the 'foe' board's shots
 * @returns {{[[[number, number]]], [[number, number]], [[number, number]]}} Object containing: 3D array friendShipPositions, 2D array friendShotPositions, 2D array foeShotsPositions
 */
function getShotsAndShipsArrays() {
    // Get the shots and ships needed to fill the DOM
    let ships = [];
    let friendShipsPositionsArray = []; // The current player's ships array
    let friendShotsPositionsArray = []; // The shot board of the current player; shots at the current player
    let foeShotsPositionsArray = []; // The shot board of the opposing player; shots at the opposing player

    // Get the data needed depending on turn
    if (playerTurn === 1) {
        ships = player1Board.getShipList();
        friendShotsPositionsArray = player1Board.getBoard();
        foeShotsPositionsArray = player2Board.getBoard();
    } else {
        ships = player2Board.getShipList();
        friendShotsPositionsArray = player2Board.getBoard();
        foeShotsPositionsArray = player1Board.getBoard();
    }

    // The ship positions array is returned as a 3D array
    for (const ship of ships) {
        let coords = ship.getCoordinateList();
        friendShipsPositionsArray.push(coords);
    }

    return {
        friendShipsPositionsArray,
        friendShotsPositionsArray,
        foeShotsPositionsArray
    }
}

export {initializeGameState, getGameBoardSize, getPlayer1, getPlayer2, getPlayer1Board, getPlayer2Board, getPlayerTurn, getBoardToShootAt ,switchPlayerTurn, getShotTakenThisTurn, setShotTakenThisTurn, switchCurrentPlayerState, resetPlayerState, getShotsAndShipsArrays}