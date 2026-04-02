/**
 * @jest-environment jsdom
 */

import * as Index from "./index.js";
import * as GameSate from "./GameState.js";
import * as DOMManipulation from "./DOMManipulation.js";

function resetState() {
    GameSate.initializeGameState();
    DOMManipulation.resetBoardElements();
    DOMManipulation.initializePlayerButtons();
}

// Boards for the tests to use
const board1 = document.createElement("div");
board1.id = "board1";
document.body.appendChild(board1);

const board2 = document.createElement("div");
board2.id = "board2";
document.body.appendChild(board2);

// Buttons for tests to use
const hideBoardsButton = document.createElement("div");
hideBoardsButton.id = "hideBoardsButton";
document.body.appendChild(hideBoardsButton);

const swapPlayersButton = document.createElement("div");
swapPlayersButton.id = "swapPlayersButton";
document.body.appendChild(swapPlayersButton);

const revealBoardsButton = document.createElement("div");
revealBoardsButton.id = "revealBoardsButton";
document.body.appendChild(revealBoardsButton);

// Setup the boards for use
const cell = document.createElement("div");
cell.classList.add("cell");

describe("index.js integration tests", () => {
    test("initialize() works", () => {
        Index.initialize();

        // GameState doesn't need to be checked since it isn't interacted with at this point
        // DOM stuff needs to be checked to ensure things are being linked correctly

        // UI state grabs buttons from the DOM, DOMManipulation then alters disables buttons in the initialize function
        expect(hideBoardsButton.disabled).toBe(true);
        expect(swapPlayersButton.disabled).toBe(true);
        expect(revealBoardsButton.disabled).toBe(true);
        
        // Check boards; UIState grabs them, DOMManipulation fills them
        expect(board1.childElementCount).toBe(100);
        expect(board2.childElementCount).toBe(100);
    });
});