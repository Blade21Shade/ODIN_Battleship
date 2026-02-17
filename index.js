import * as DOMManipulation from "./DOMManipulation.js"
import * as GameEngine from "./GameEngine.js";
import * as GameState from "./GameState.js"
import * as UIState from "./UIState.js"

GameState.initializeGameState();
UIState.initializeUIState();
DOMManipulation.initializeBoardElements();
DOMManipulation.initializePlayerButtons();