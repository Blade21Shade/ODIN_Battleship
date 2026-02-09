import Ship from "./Ship.js"
import Gameboard from "./Gameboard.js"
import Player from "./Player.js"
import * as DOMManipulation from "./DOMManipulation.js"

let gameBoardSize;
let playerTurn; // // Swaps between 1 and 2 to control game actions

let player1Board;
let player2Board;

let player1;
let player2;

let board1Element;
let board2Element;

let preventProcessing = false; // When a game action is taken, this is set to prevent players from continuing to click and causing potential logic issues

/**
 * Sets up variables needed for the game to run and initial DOM setup
 */
function initializeGameState() {
    gameBoardSize = 10;
    playerTurn = 1;

    player1Board = new Gameboard(gameBoardSize);
    player2Board = new Gameboard(gameBoardSize);

    player1 = new Player(player1Board);
    player2 = new Player(player2Board);

    // These do not map to player1 and player2, they change based on the current player
    board1Element = DOMManipulation.grabBoardElement(1); // Show the active player's board with their ships and shots from the opposing player
    board2Element = DOMManipulation.grabBoardElement(2); // Shows the opposing player's board without ships and the active player's shots

    DOMManipulation.initializeBoardElements();
}

/**
 * Attempts to get the idNumber from a cell on the "shoot at" board
 * @param {Element} cell The cell to extract the ID from
 * @returns cell marked as foe: The idNumber of the cell
 * @returns cell isn't marked as foe: -1 
 */
function getIDNumberOfClickedCell(cell) {
    let idNum = -1;

    // Only evaluate cells which haven't been shot at
    if (cell.classList.contains("cell") && cell.classList.contains("foe")) {
        let idString = cell.id;
        
        // Cell id's are in the form: boardX-cellYZ ; YZ can be < 10, in which case it only has one character for the number
        if (isNaN(idString.at(-2))) { // If the second to last character isn't a number only grab the last character
            idNum = Number(idString.at(-1));
        } else {
            idNum = Number(idString.at(-2) + idString.at(-1));
        }
    }

    return idNum;
}

/**
 * Attempts to process the given cell idNumber onto the given board
 * @param {number} idNum The idNumber of a cell
 * @param {Gameboard} board The board to process the idNumber against
 * @returns True if the click was valid (hit or miss), or False if it was invalid
 */
function processIDNumberOnBoard(idNum, board) {
    let clickCouldBeProcessed = false;

    // If idNum isn't in the valid range, don't do anything
    if (idNum < 0 || idNum > 99) {
        return clickCouldBeProcessed;
    }

    // Find the coordinate of this id
    // See note in DOMManipulation.js's fillBoardElementShips(...) for the logic of this math; this math is different than that math
    // The math here constructs a position from a cell number, the math in fillBoardElementShips() constructs a cell number from a position
    let x = idNum % 10;
    let y = Math.floor(idNum/10);
    let coord = [x,y];

    // Actual processing
    let hitVal = -10;
    try {
        hitVal = board.fireAtBoard(coord);
        if (hitVal === -1 || hitVal === 1) { // Hit or miss
            clickCouldBeProcessed = true;
        }
    } catch (error) {
        return clickCouldBeProcessed; // If fireAtBoard() receives a coordinate that has already been shot at it throws an error, in which case do nothing
    }

    return clickCouldBeProcessed;
}

/**
 * Adds the gameplay event listener to board2element
 */
function enableGameplayEventListener() {
    board2Element.addEventListener("click", gameplayEventListenerCallback);
}

/**
 * This function handles what happens when the game starts and players start clicking the "shoot at" board to fire at their opponent
 * @param {Event} event The event coming from the event listener this callback is attached to
 */
function gameplayEventListenerCallback(event) {
    // If the previous action is still processing prevent more actions from processing
    if (preventProcessing) {
        return;
    } else {
        preventProcessing = true;
    }

    // Process what the click did to the game
    let board = playerTurn === 1 ? player2Board : player1Board;

    let cellNumberClicked = getIDNumberOfClickedCell(event.target);
    let couldBeProcessed = processIDNumberOnBoard(cellNumberClicked, board);
    if (couldBeProcessed) {
        triggerNextGameStep(board);
    } else {
        alert("Invalid click, try another cell!");
        preventProcessing = false;
    }
}

/**
 * Causes the next game step to occur: either end the game, or swap players and continue
 * @param {Gameboard} board The board to check to see if all ships have been sunk on it
 */
function triggerNextGameStep(board) {
    let allShipsSunk = board.getAllShipsSunk();
    
    // See if the game should end
    if (allShipsSunk) {
        endGame();
        return;
    }

    // The game didn't end, setup for player swap

    /**
     * ? Obfuscate screen so players don't accidentally see each other's boards
     * Reset each DOM board
     * Fill DOM boards with information for next player
     * Swap players
     */

    // Swap players
    // playerTurn = playerTurn === 1 ? 2 : 1; // Swap which player is active
    // preventProcessing = false;
}

/**
 * Function that will handle end of game logic
 */
function endGame() {

    playerTurn = 1;
    preventProcessing = false;
}



export {getIDNumberOfClickedCell, processIDNumberOnBoard, initializeGameState, enableGameplayEventListener}