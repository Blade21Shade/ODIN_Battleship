/**
 * @jest-environment jsdom
 */

import * as index from "./index.js"

const board1 = document.createElement("div");
board1.id = "board1";
const board2 = document.createElement("div");
board2.id = "board2";

document.body.appendChild(board1);
document.body.appendChild(board2);

const hideButton = document.createElement("button");
hideButton.id = "hideBoardsButton";
const swapButton = document.createElement("button");
swapButton.id = "swapPlayersButton";
const revealButton = document.createElement("button");
revealButton.id = "revealBoardsButton";

document.body.appendChild(hideButton);
document.body.appendChild(swapButton);
document.body.appendChild(revealButton);

describe("index tests", () => {
    test("Initialize function", () => {
        index.initialize();
    });
});