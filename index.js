import * as DOMManipulation from "./DOMManipulation.js"
import * as GameEngine from "./GameEngine.js";
import * as GameState from "./GameState.js"
import * as UIState from "./UIState.js"
import * as Tools from "./Tools.js"

initialize();
DOMManipulation.enablePlaceShipHandlers();
Tools.setAdditionalToGetEachDirection(1);
Tools.setSearchDirection(DOMManipulation.DIRECTION.HORIZONTAL);

// Initialize the game state and DOM
function initialize() {
    GameState.initializeGameState();
    UIState.initializeUIState();
    DOMManipulation.initializeBoardElements();
    DOMManipulation.initializePlayerButtons();
}

export {initialize}