import DOMManipulation, { FRIEND_OR_FOE, VALID_CELL_CLASSES, BOARD_NUMBER, BUTTON_NAMES } from "./DOMManipulation.js"
import * as GameEngine from "./GameEngine.js";
import * as GameState from "./GameState.js"
import * as GameSetup from "./GameSetup.js"
import * as UIState from "./UIState.js"
import * as Tools from "./Tools.js"
import * as self from "./index.js"

/**
 * The values that currentState can be set to
 * - Setup: used when players need to place their ships
 * - Gameplay: used when players need to take shots at the other's board
 */
const SETUP_OR_GAMEPLAY = Object.freeze({
    SETUP: "setup",
    GAMEPLAY: "gameplay"
});

/**
 * Holds the current state of the program
 * - Allowed values are held in SETUP_OR_GAMEPLAY
 */
let currentState;

/** 
 * Initialize the game state and DOM
 */
function initialize() {
    GameState.initializeGameState();
    UIState.initializeUIState();
    GameSetup.initializeOrReset();
    DOMManipulation.initializeBoardElements();
    DOMManipulation.initializePlayerButtons();
    setCurrentState(SETUP_OR_GAMEPLAY.SETUP);
    enableSwapProcessButtonEventListeners();
    initializeDialogSubElements();
}

/** 
 * Functionality for testing index.html with Live Preview is enabled through calling this.
 * This function should be deleted once the project is finished  
 */ 
function testingNeeds() {
    GameSetup.enableSelectShipLengthButtonHandlers();
    GameSetup.enableShipPlacementHandlers();

    let endGameDialog = UIState.getEndGameDialog();
    endGameDialog.showModal();
}

/**
 * Sets currentState
 * @param {SETUP_OR_GAMEPLAY} setupOrGameplay One of SETUP_OR_GAMEPLAY's values
 * @throws If given a non SETUP_OR_GAMEPLAY value
 */
function setCurrentState(setupOrGameplay) {
    // If the given value isn't in SETUP_OR_GAMEPLAY, throw
    if (!Object.values(SETUP_OR_GAMEPLAY).includes(setupOrGameplay)) {
        invalidStateThrow();
    }

    currentState = setupOrGameplay;
}

function getCurrentState() {
    return currentState;
}

function invalidStateThrow() {
    throw new Error("Invalid state given: must be 'setup' or 'gameplay'");
}

/**
 * Adds the shot listener to board2
 */
function enableShotListener() {
    let board2Element = UIState.getBoard2Element();
    board2Element.addEventListener("click", shotListener);
}

/**
 * Removes the shot listener from board2
 */
function disableShotListener() {
    let board2Element = UIState.getBoard2Element();
    board2Element.removeEventListener("click", shotListener);
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
        // Update the DOM board so the player can see the outcome of their shot
        let shotVal = GameState.getLastShotValue();
        let hitOrMiss;
        if (shotVal === 1) {
            hitOrMiss = VALID_CELL_CLASSES.HIT;
        } else {
            hitOrMiss = VALID_CELL_CLASSES.MISS;
        }
        DOMManipulation.addClassToCell(idNumOfClickedCell, hitOrMiss, FRIEND_OR_FOE.FOE);
        
        let gameShouldEnd = GameEngine.endGameCheck();
        if (gameShouldEnd) {
            // End of game logic
            self.disableSwapProcessButtonEventListeners();
            // Put up some kind of graphic showing game info !!!
            let endGameDialog = UIState.getEndGameDialog();
            self.fillEndGameDialog();
            endGameDialog.showModal();
        } else { // Game doesn't end
            // Enable the hide button so the players can start the swap process
            DOMManipulation.enableButton(DOMManipulation.BUTTON_NAMES.HIDE_BOARDS);
        }
    } else { // Invalid shot
        // Differ messages based on if the player has taken a shot or not
        if (GameState.getShotTakenThisTurn()) {
            alert("Shot already taken, switch to next player!");
        } else {
            alert("Invalid shot, try another cell!");
        }
        
    }
}

/**
 * Fills the end of game dialog with all the stats for players to see
 */
function fillEndGameDialog() {
    // Boards
    self.fillEndGameDialogBoard(1);
    self.fillEndGameDialogBoard(2);

    // Stats - after boards as it relies on boards being filled to gather stats
    self.fillEndGameDialogStats(1);
    self.fillEndGameDialogStats(2);
}

/**
 * Fills a board for a player in the End of Game dialog
 * @param {number} playerNumber The player to fill the information for
 * - Must be 1 or 2
 * @throws If playerNumber isn't 1 or 2
 */
function fillEndGameDialogBoard(playerNumber) {
    let workingBoard;
    if (playerNumber === 1) {
        workingBoard = UIState.getPlayer1EndBoard();
    } else if (playerNumber === 2) {
        workingBoard = UIState.getPlayer2EndBoard();
    } else {
        throw new Error(`Player number must be 1 or 2; given ${playerNumber}`);
    }

    let {friendShipsPositionsArray, friendShotsPositionsArray, foeShotsPositionsArray} = GameState.getShotsAndShipsArrays(playerNumber);
    DOMManipulation.fillBoardElementShots(friendShotsPositionsArray, DOMManipulation.FRIEND_OR_FOE.FRIEND, workingBoard);
    DOMManipulation.fillBoardElementShips(friendShipsPositionsArray, DOMManipulation.FRIEND_OR_FOE.FRIEND, workingBoard);
    
}

/**
 * Fills the shot stats for a player in the End of Game dialog
 * @param {number} playerNumber The player to fill the information for
 * - Must be 1 or 2
 * @throws If playerNumber isn't 1 or 2
 */
function fillEndGameDialogStats(playerNumber) {
     /**
     * Number of shots taken
     * Number of hits | misses
     * Hit %
     * Number of hits needed to win
     */
    let shotStats; // Container
    let workingBoard; // Board
    let shotsSpan;
    let hitsSpan;
    let missSpan;
    let hitPercentSpan;
    let hitsToWinSpan;

    if (playerNumber === 1) {
        shotStats = UIState.getShotsStatsPlayer1();
        shotsSpan = UIState.getShotsSpanPlayer1();
        hitsSpan = UIState.getHitsSpanPlayer1();
        missSpan = UIState.getMissesSpanPlayer1();
        hitPercentSpan = UIState.getHitPercentSpanPlayer1();
        hitsToWinSpan = UIState.getHitsToWinSpanPlayer1();
        workingBoard = UIState.getPlayer2EndBoard();
    } else if (playerNumber === 2) {
        shotStats = UIState.getShotsStatsPlayer2();
        shotsSpan = UIState.getShotsSpanPlayer2();
        hitsSpan = UIState.getHitsSpanPlayer2();
        missSpan = UIState.getMissesSpanPlayer2();
        hitPercentSpan = UIState.getHitPercentSpanPlayer2();
        hitsToWinSpan = UIState.getHitsToWinSpanPlayer2();
        workingBoard = UIState.getPlayer1EndBoard();
    } else {
        throw new Error(`Player number must be 1 or 2; given ${playerNumber}`);
    }
    
    let hits = 0;
    let misses = 0;

    for (let i = 0; i < 100; i++) {
        let cellClassList = workingBoard.children[i].classList;
        if (cellClassList.contains("hit")) {
            hits++;
        } else if (cellClassList.contains("miss")) {
            misses++;
        }
    }

    let shots = hits + misses;
    let hitPercent = Math.floor((hits/shots) * 100); // * 100 for a percent value, then floor to get rid of remaining decimal numbers
    let hitsNeededToWin = 17 - hits; // 17 is the sum of the length of the ships
    
    shotStats.title = "Stats are for shots at opponent's board";
    shotsSpan.innerText = shots;
    hitsSpan.innerText = hits;
    missSpan.innerText = misses;
    hitPercentSpan.innerText = hitPercent;
    hitsToWinSpan.innerText = hitsNeededToWin;
}

/**
 * Initializes elements inside Dialogs
 * - This will setup both the pre-game and end-of-game dialogs, and therefore should be called before player's place ships
 */
function initializeDialogSubElements() {
    
    // Create board elements
    let player1Board = UIState.getPlayer1EndBoard();
    let player2Board = UIState.getPlayer2EndBoard();

    const cell = document.createElement("div");
    cell.classList.toggle("cell");

    for (let i = 0; i < 100; i++) {
        let clone = cell.cloneNode();
        clone.classList.toggle("friend");
        clone.id = `endGameBoard1-cell${i}`;
        player1Board.appendChild(clone);

        clone = cell.cloneNode();
        clone.classList.toggle("friend");
        clone.id = `endGameBoard2-cell${i}`;
        player2Board.appendChild(clone);
    }

    /* Initialize buttons */
    // End game dialog
    let playAgainButton = UIState.getPlayAgainButton();
    let endGameDialog = UIState.getEndGameDialog();
    playAgainButton.addEventListener("click", () => {
        // Re-initialize all game stuff !!!
        
        endGameDialog.close();
    });
}

/**
 * Creates an onclick event listener for each of the swap-player-process buttons using the corresponding callback functions for each button
 */
function enableSwapProcessButtonEventListeners() {
    let hideBoardsButton = UIState.getHideBoardsButton();
    let swapPlayersButton = UIState.getSwapPlayersButton();
    let revealBoardsButton = UIState.getRevealBoardsButton();
    
    hideBoardsButton.addEventListener("click", hideBoardsCallback);
    swapPlayersButton.addEventListener("click", swapPlayersCallback);
    revealBoardsButton.addEventListener("click", revealBoardsCallback);
}

/**
 * Removes the onclick event listeners from each of the swap-player-process buttons
 */
function disableSwapProcessButtonEventListeners() {
    let hideBoardsButton = UIState.getHideBoardsButton();
    let swapPlayersButton = UIState.getSwapPlayersButton();
    let revealBoardsButton = UIState.getRevealBoardsButton();
    
    hideBoardsButton.removeEventListener("click", hideBoardsCallback);
    swapPlayersButton.removeEventListener("click", swapPlayersCallback);
    revealBoardsButton.removeEventListener("click", revealBoardsCallback);
}

/**
 * Prepares for player swapping
 * - Resets each DOM board
 * - Enables the 'swap players' button
 * - Disables the hide boards button (the button this is attached to)
 * - Switches currentState to 'gameplay' if both players have placed their ships
 */
function hideBoardsCallback() {
    // If in the setup state, update GameSetup, and if both players have placed their ships, switch to gameplay state
    if (currentState === SETUP_OR_GAMEPLAY.SETUP) {
        GameSetup.incrementNumberOfPlayersThatHavePlacedAllShips();
        if (GameSetup.getNumberOfPlayersThatHavePlacedAllShips() === 2) {
            self.setCurrentState(SETUP_OR_GAMEPLAY.GAMEPLAY);
            self.enableShotListener();
        }
    }

    DOMManipulation.resetBoardElements();
    DOMManipulation.enableButton(DOMManipulation.BUTTON_NAMES.SWAP_PLAYERS);
    DOMManipulation.disableButton(DOMManipulation.BUTTON_NAMES.HIDE_BOARDS);
}

/**
 * Switches players
 * - Enables the reveal boards button
 * - Disables the swap players button (the button this is attached to)
 */
function swapPlayersCallback() {
    DOMManipulation.enableButton(DOMManipulation.BUTTON_NAMES.REVEAL_BOARDS);
    DOMManipulation.disableButton(DOMManipulation.BUTTON_NAMES.SWAP_PLAYERS);

    GameState.switchCurrentPlayerState();
}

/**
 * Reveals the boards so the now-active player can take their turn
 * - Disables the reveal boards button (the button this is attached to)
 */
function revealBoardsCallback() {
    if (currentState === SETUP_OR_GAMEPLAY.SETUP) {
        // Allow the next player to place their ships
        GameSetup.initializeOrReset();
    } else if (currentState === SETUP_OR_GAMEPLAY.GAMEPLAY) {
        // Get the board information from GameState and pass it to DOMManipulation so the user can see the boards
        let {friendShipsPositionsArray, friendShotsPositionsArray, foeShotsPositionsArray} = GameState.getShotsAndShipsArrays();
        let board1 = UIState.getBoard1Element();
        let board2 = UIState.getBoard2Element();
        DOMManipulation.fillBoardElementsAll(friendShipsPositionsArray, friendShotsPositionsArray, foeShotsPositionsArray, board1, board2);
        GameState.setShotTakenThisTurn(false);
    } else {
        invalidStateThrow();
    }
    
    // Allow next player to take their turn
    DOMManipulation.disableButton(DOMManipulation.BUTTON_NAMES.REVEAL_BOARDS);
}

export {initialize, testingNeeds, shotListener, enableShotListener, disableShotListener, enableSwapProcessButtonEventListeners, disableSwapProcessButtonEventListeners, SETUP_OR_GAMEPLAY, hideBoardsCallback, swapPlayersCallback, revealBoardsCallback, setCurrentState, getCurrentState, fillEndGameDialog, initializeDialogSubElements, fillEndGameDialogBoard, fillEndGameDialogStats}