import Ship from "./Ship.js"
import GameBoard from "./GameBoard.js"
import Player from "./Player.js"
import * as DOMManipulation from "./DOMManipulation.js"
import * as GameState from "./GameState.js"
import * as UIState from "./UIState.js"

let preventProcessing = false; // When a game action is taken, this is set to prevent players from continuing to click and causing potential logic issues

function getPreventProcessing() {
    return preventProcessing;
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
 * @param {GameBoard} board The board to process the idNumber against
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
 * Creates an onclick event listener for each of the player buttons using the corresponding callback functions for each button
 */
function enableButtonEventListeners() {
    let hideBoardsButton = UIState.getHideBoardsButton();
    let swapPlayersButton = UIState.getSwapPlayersButton();
    let revealBoardsButton = UIState.getRevealBoardsButton();
    
    hideBoardsButton.addEventListener("click", hideBoardsCallback);
    swapPlayersButton.addEventListener("click", swapPlayersCallback);
    revealBoardsButton.addEventListener("click", revealBoardsCallback);
}

/**
 * Prepares for player swapping by resetting each DOM board, enabling the swap players button, and disabling the hide boards button (the button this is attached to)
 */
function hideBoardsCallback() {
    DOMManipulation.resetBoardElementsCells();
    DOMManipulation.enableButton(DOMManipulation.BUTTON_NAMES.SWAP_PLAYERS);
    DOMManipulation.disableButton(DOMManipulation.BUTTON_NAMES.HIDE_BOARDS);
}

/**
 * Switches players, enables the reveal boards button, disables the swap players button (the button this is attached to)
 */
function swapPlayersCallback() {
    DOMManipulation.enableButton(DOMManipulation.BUTTON_NAMES.REVEAL_BOARDS);
    DOMManipulation.disableButton(DOMManipulation.BUTTON_NAMES.SWAP_PLAYERS);

    GameState.switchPlayerTurn();
}

/**
 * Reveals the boards so the now-active player can take their turn, disables the reveal boards button (the button this is attached to) 
 */
function revealBoardsCallback() {
    // Get the shots and ships needed to fill the DOM
    let ships = [];
    let friendShipsPositionsArray = []; // The current player's ships array
    let friendShotsPositionsArray = []; // The shot board of the current player; shots at the current player
    let foeShotsPositionsArray = []; // The shot board of the opposing player; shots at the opposing player
    
    // Get the player boards
    let player1Board = GameState.getPlayer1Board();
    let player2Board = GameState.getPlayer2Board();
    let playerTurn = GameState.getPlayerTurn();

    if (playerTurn === 1) {
        ships = player1Board.getShipList();
        friendShotsPositionsArray = player1Board.getBoard();
        foeShotsPositionsArray = player2Board.getBoard();
    } else {
        ships = player2Board.getShipList();
        friendShotsPositionsArray = player2Board.getBoard();
        foeShotsPositionsArray = player1Board.getBoard();
    }

    for (const ship of ships) {
        let coords = ship.getCoordinateList();
        friendShipsPositionsArray.push(coords);
    }

    // Fill the DOM
    DOMManipulation.fillBoardElementShots(friendShotsPositionsArray, DOMManipulation.FRIEND_OR_FOE.FRIEND, 1);
    DOMManipulation.fillBoardElementShips(friendShipsPositionsArray, DOMManipulation.FRIEND_OR_FOE.FRIEND, 1);

    DOMManipulation.fillBoardElementShots(foeShotsPositionsArray, DOMManipulation.FRIEND_OR_FOE.FOE, 2);

    // Allow next player to take their turn
    DOMManipulation.disableButton(DOMManipulation.BUTTON_NAMES.REVEAL_BOARDS);
    preventProcessing = false; // Allow the current player to make shots against the board
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
    let board;
    let playerTurn = GameState.getPlayerTurn();
    if (playerTurn === 1) {
        board = GameState.getPlayer2Board();
    } else {
        board = GameState.getPlayer1Board();
    }

    let cellNumberClicked = getIDNumberOfClickedCell(event.target); // target will be a cell within the board
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
 * @param {GameBoard} board The board to check to see if all ships have been sunk on it
 */
function triggerNextGameStep(board) {
    let allShipsSunk = board.getAllShipsSunk();
    
    // See if the game should end
    if (allShipsSunk) {
        endGame();
        return;
    }

    // The game didn't end, enable the hide button so the players can start the swap process
    DOMManipulation.enableButton(DOMManipulation.BUTTON_NAMES.HIDE_BOARDS);
}

/**
 * Function that will handle end of game logic
 */
function endGame() {

    playerTurn = 1;
    preventProcessing = false;
}



export {getIDNumberOfClickedCell, processIDNumberOnBoard, enableGameplayEventListener, enableButtonEventListeners, revealBoardsCallback, getPreventProcessing}