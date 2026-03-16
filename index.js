import * as DOMManipulation from "./DOMManipulation.js"
import * as GameEngine from "./GameEngine.js";
import * as GameState from "./GameState.js"
import * as UIState from "./UIState.js"
import * as Tools from "./Tools.js"

initialize();
DOMManipulation.enablePlaceShipHandlers();

// Initialize the game state and DOM
function initialize() {
    GameState.initializeGameState();
    UIState.initializeUIState();
    DOMManipulation.initializeBoardElements();
    DOMManipulation.initializePlayerButtons();
}

/**
 * Adds the shot listener to board2
 */
function enableShotListener() {
    let board2Element = UIState.getBoard2Element();
    board2Element.addEventListener("click", shotListener());
}

/**
 * Removes the shot listener from board2
 */
function disableShotListener() {
    let board2Element = UIState.getBoard2Element();
    board2Element.removeEventListener("click", shotListener());
}

/**
 * Attempts to fire a shot at the 'foe' board
 * @param {Event} event The click event from a user clicking on the 'foe' board to fire a shot at it 
 */
function shotListener(event) {
    // Get idNumber of a DOM cell, translate it to a GameBoard coordinate, then attempt to shoot at that coordinate
    let idNumOfClickedCell = Tools.getIDNumberFromIDString(event.target.id);
    let coord = Tools.createCoordinateFromIDNumber(idNumOfClickedCell);

    let wasValidShot = GameEngine.shootAtCoordinate(coord);
    if (wasValidShot) {
        let gameShouldEnd = GameEngine.endGameCheck();

        if (gameShouldEnd) {
            // End of game logic
        } else { // Game doesn't end
            // Enable the hide button so the players can start the swap process
            DOMManipulation.enableButton(DOMManipulation.BUTTON_NAMES.HIDE_BOARDS);
        }
    } else { // Invalid shot
        alert("Invalid shot, try another cell!");
    }
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
 * Removes the onclick event listeners for each of the player buttons
 */
function disableButtonEventListeners() {
    let hideBoardsButton = UIState.getHideBoardsButton();
    let swapPlayersButton = UIState.getSwapPlayersButton();
    let revealBoardsButton = UIState.getRevealBoardsButton();
    
    hideBoardsButton.removeEventListener("click", hideBoardsCallback);
    swapPlayersButton.removeEventListener("click", swapPlayersCallback);
    revealBoardsButton.removeEventListener("click", revealBoardsCallback);
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

    GameState.switchCurrentPlayerState();
}

/**
 * Reveals the boards so the now-active player can take their turn, disables the reveal boards button (the button this is attached to) 
 */
function revealBoardsCallback() {
    // Get the board information from GameState and pass it to DOMManipulation so the user can see the boards
    let {friendShipsArray, friendShotsArray, foeShotsArray} = GameState.getShotsAndShipsArrays();
    DOMManipulation.fillBoardElementsAll(friendShipsArray, friendShotsArray, foeShotsArray);

    // Allow next player to take their turn
    DOMManipulation.disableButton(DOMManipulation.BUTTON_NAMES.REVEAL_BOARDS);
    GameState.setShotTakenThisTurn(false);
}

export {initialize}