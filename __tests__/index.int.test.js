/**
 * @jest-environment jsdom
 */

import * as Index from "../src/index.js";
import * as GameSate from "../src/GameState.js";
import * as DOMManipulation from "../src/DOMManipulation.js";

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

// Update-ship-length buttons
const select5LengthShipButton = document.createElement("button");
select5LengthShipButton.id = "select5LengthShipButton";
select5LengthShipButton.className = "";
select5LengthShipButton.disabled = false;
document.body.appendChild(select5LengthShipButton);

const select4LengthShipButton = document.createElement("button");
select4LengthShipButton.id = "select4LengthShipButton";
select4LengthShipButton.className = "";
select4LengthShipButton.disabled = false;
document.body.appendChild(select4LengthShipButton);

const select3LengthShipButton = document.createElement("button");
select3LengthShipButton.id = "select3LengthShipButton";
select3LengthShipButton.className = "";
select3LengthShipButton.disabled = false;
document.body.appendChild(select3LengthShipButton);

const select2LengthShipButton = document.createElement("button");
select2LengthShipButton.id = "select2LengthShipButton";
select2LengthShipButton.className = "";
select2LengthShipButton.disabled = false;
document.body.appendChild(select2LengthShipButton);

// Update-ship-length spans
const select5LengthShipSpan = document.createElement("span");
select5LengthShipSpan.id = "select5LengthShipSpan";
select5LengthShipSpan.innerText = "1";
document.body.appendChild(select5LengthShipSpan);

const select4LengthShipSpan = document.createElement("span");
select4LengthShipSpan.id = "select4LengthShipSpan";
select4LengthShipSpan.innerText = "1";
document.body.appendChild(select4LengthShipSpan);

const select3LengthShipSpan = document.createElement("span");
select3LengthShipSpan.id = "select3LengthShipSpan";
select3LengthShipSpan.innerText = "1";
document.body.appendChild(select3LengthShipSpan);

const select2LengthShipSpan = document.createElement("span");
select2LengthShipSpan.id = "select2LengthShipSpan";
select2LengthShipSpan.innerText = "1";
document.body.appendChild(select2LengthShipSpan);

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