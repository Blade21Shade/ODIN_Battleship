import * as DOMManipulation from "./DOMManipulation.js"

// Buttons the players will use when swapping who can see the screen
let hideBoardsButton;
let swapPlayersButton; // Logical swap for player clarity
let revealBoardsButton;

// These do not map to player1 and player2, they change based on the current player
let board1Element; // The active player's board with their ships and shots from the opposing player
let board2Element; // The opposing player's board without ships and the active player's shots

function initializeUIState() {
    board1Element = document.querySelector("#board1");
    board2Element = document.querySelector("#board2");

    hideBoardsButton = document.querySelector("#hideBoardsButton");
    swapPlayersButton = document.querySelector("#swapPlayersButton");
    revealBoardsButton = document.querySelector("#revealBoardsButton");
}

function getHideBoardsButton() {
    return hideBoardsButton;
}

function getSwapPlayersButton() {
    return swapPlayersButton;
}

function getRevealBoardsButton() {
    return revealBoardsButton;
}

function getBoard1Element() {
    return board1Element;
}

function getBoard2Element() {
    return board2Element;
}

export {initializeUIState, getBoard1Element, getBoard2Element, getHideBoardsButton, getRevealBoardsButton, getSwapPlayersButton}