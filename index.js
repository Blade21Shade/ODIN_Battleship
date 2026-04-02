import DOMManipulation from "./DOMManipulation.js"
import * as GameEngine from "./GameEngine.js";
import * as GameState from "./GameState.js"
import GameBoard from "./GameBoard.js"
import * as UIState from "./UIState.js"
import * as Tools from "./Tools.js"

/** 
 * Initialize the game state and DOM
 */
function initialize() {
    GameState.initializeGameState();
    UIState.initializeUIState();
    DOMManipulation.initializeBoardElements();
    DOMManipulation.initializePlayerButtons();
}

/** 
 * Functionality for testing index.html with Live Preview is enabled through calling this.
 * This function should be deleted once the project is finished  
 */ 
function testingNeeds() {
    DOMManipulation.enablePlaceShipHandlers();
    enablePlaceShipClickHandlers();
}

function enablePlaceShipClickHandlers() {
    let board1Element = UIState.getBoard1Element();
    board1Element.addEventListener("click", placeShipClick);
    board1Element.addEventListener("contextmenu", removeShipClick);
}

function disablePlaceShipClickHandlers() {
    let board1Element = UIState.getBoard1Element();
    board1Element.removeEventListener("click", placeShipClick);
    board1Element.removeEventListener("contextmenu", removeShipClick);
}

/**
 * Attempts to place a ship onto the active player's GameBoard. If placement is valid, the DOM is updated to match.
 * @param {Event} event A click event from the user attempting to place a ship
 */
function placeShipClick(event) {
    let cell = event.target;

    // Get the idList for this ship
    let idString = cell.id;
    let idNumber = Tools.getIDNumberFromIDString(idString);
    let idList = Tools.createIDListFromIDNumber(idNumber);

    // Check if the length of idList matches the expected length 
    let expectedLength = false;
    let additionalReach = Tools.getAdditionalToGetEachDirection();
    if (additionalReach === 0) { // Special case
        if (idList.length === 2) {
            expectedLength = true;
        }
    } else {
        if (idList.length === 1 + additionalReach*2) {
            expectedLength = true;
        }
    }

    // If the length was invalid, do nothing
    // This will occur if the user tries to click when part of their ship goes beyond an edge of the board
    if (!expectedLength) {
        return;
    }
    
    // Get the board to place on
    let playerTurn = GameState.getPlayerTurn();
    /**
     * @type {GameBoard}
     */
    let boardToPlaceOn;
    if (playerTurn === 1) {
        boardToPlaceOn = GameState.getPlayer1Board();
    } else {
        boardToPlaceOn = GameState.getPlayer2Board();
    }

    // Get the coordinates to place at
    let start = Tools.createCoordinateFromIDNumber(idList.at(-1)); // ID lists are created in such a way that the last two entries represent the ends of a ship
    let end = Tools.createCoordinateFromIDNumber(idList.at(-2));

    // Attempt the actual placement
    let couldBePlaced = boardToPlaceOn.placeShip(start, end);

    if (!couldBePlaced) {
        return;
    }

    // Ship placed, update the DOM
    DOMManipulation.removePlaceShipClassHandler(event);
    DOMManipulation.addShipClassToIDList(idList);
}

/**
 * Attempts to remove a ship from the active player's GameBoard. If removal was valid, the DOM is updated to match.
 * @param {Event} event A 'contextmenu' event from the user attempting to right-click a ship
 */
function removeShipClick(event) {
    let cell = event.target;

    // If the right-clicked cell doesn't contain the ship class, don't do anything
    if (!cell.classList.contains("ship")) {
        return;
    }

    // Ship, get the idList for it
    let idString = cell.id;
    let idNumber = Tools.getIDNumberFromIDString(idString);

    // Remove from the GameBoard
    // Get the board to remove from
    let playerTurn = GameState.getPlayerTurn();
    /** @type {GameBoard} */
    let boardToPlaceOn;
    if (playerTurn === 1) {
        boardToPlaceOn = GameState.getPlayer1Board();
    } else {
        boardToPlaceOn = GameState.getPlayer2Board();
    }

    // Remove the ship
    let coord = Tools.createCoordinateFromIDNumber(idNumber);
    let removedCoords = boardToPlaceOn.removeShipByCoordinate(coord);
    
    // Create an idList from the removed coordinates
    let idList = [];
    for (const coord of removedCoords) {
        let id = Tools.createIDNumberFromCoordinate(coord);
        idList.push(id);
    }

    // Ship removed, update the DOM
    DOMManipulation.removeShipClassFromIDList(idList);
    DOMManipulation.addPlaceShipClassHandler(event);
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
    DOMManipulation.resetBoardElements();
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

export {initialize, testingNeeds, placeShipClick, removeShipClick}