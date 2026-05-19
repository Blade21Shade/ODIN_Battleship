// Buttons the user uses to select ship sizes
/** @type {HTMLButtonElement} */
let select2LengthShipButton;
/** @type {HTMLButtonElement} */
let select3LengthShipButton;
/** @type {HTMLButtonElement} */
let select4LengthShipButton;
/** @type {HTMLButtonElement} */
let select5LengthShipButton;

/**
 * Holds the currently selected button users use to select ship sizes
 * @type {HTMLButtonElement}
 */
let currentlySelectedXLengthShipButton;

// Spans for the buttons the user uses to select ship sizes; these are so the player knows how many ships they need to place
/** @type {HTMLSpanElement} */
let select2LengthShipSpan;
/** @type {HTMLSpanElement} */
let select3LengthShipSpan;
/** @type {HTMLSpanElement} */
let select4LengthShipSpan;
/** @type {HTMLSpanElement} */
let select5LengthShipSpan;

// Buttons the players will use when swapping who can see the screen
/** @type {HTMLButtonElement} */
let hideBoardsButton;
/** @type {HTMLButtonElement} */
let swapPlayersButton; // Logical swap for player clarity
/** @type {HTMLButtonElement} */
let revealBoardsButton;

// These do not map to player1 and player2, they change based on the current player
/** @type {HTMLDivElement} */
let board1Element; // The active player's board with their ships and shots from the opposing player
/** @type {HTMLDivElement} */
let board2Element; // The opposing player's board without ships and the active player's shots

/**
 * Assigns each variable to the DOM element it refers to
 */
function initializeUIState() {
    board1Element = document.querySelector("#board1");
    board2Element = document.querySelector("#board2");

    select2LengthShipButton = document.querySelector("#select2LengthShipButton");
    select3LengthShipButton = document.querySelector("#select3LengthShipButton");
    select4LengthShipButton = document.querySelector("#select4LengthShipButton");
    select5LengthShipButton = document.querySelector("#select5LengthShipButton");

    select2LengthShipSpan = document.querySelector("#select2LengthShipSpan");
    select3LengthShipSpan = document.querySelector("#select3LengthShipSpan");
    select4LengthShipSpan = document.querySelector("#select4LengthShipSpan");
    select5LengthShipSpan = document.querySelector("#select5LengthShipSpan");

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

function getSelect2LengthShipButton() {
    return select2LengthShipButton;
}

function getSelect3LengthShipButton() {
    return select3LengthShipButton;
}

function getSelect4LengthShipButton() {
    return select4LengthShipButton;
}

function getSelect5LengthShipButton() {
    return select5LengthShipButton;
}

function getSelect2LengthShipSpan() {
    return select2LengthShipSpan;
}

function getSelect3LengthShipSpan() {
    return select3LengthShipSpan;
}

function getSelect4LengthShipSpan() {
    return select4LengthShipSpan;
}

function getSelect5LengthShipSpan() {
    return select5LengthShipSpan;
}

function getCurrentlySelectedXLengthShipButtonID() {
    return currentlySelectedXLengthShipButton.id;
}

function setCurrentlySelectedXLengthShipButton(length) {
    let setTo;
    switch(Number(length)) {
        case 2:
            setTo = select2LengthShipButton;
            break;
        case 3:
            setTo = select3LengthShipButton;
            break;
        case 4:
            setTo = select4LengthShipButton;
            break;
        case 5:
            setTo = select5LengthShipButton;
            break;
        default:
            throw new Error("Invalid length given, only lengths of 2-5 are valid");
    }

    currentlySelectedXLengthShipButton = setTo;
}

export {initializeUIState, getBoard1Element, getBoard2Element, getHideBoardsButton, getRevealBoardsButton, getSwapPlayersButton, getSelect2LengthShipButton, getSelect3LengthShipButton, getSelect4LengthShipButton, getSelect5LengthShipButton, getSelect2LengthShipSpan, getSelect3LengthShipSpan, getSelect4LengthShipSpan, getSelect5LengthShipSpan, getCurrentlySelectedXLengthShipButtonID, setCurrentlySelectedXLengthShipButton}