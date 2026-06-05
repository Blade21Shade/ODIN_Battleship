// Dialogs
/** @type {HTMLDialogElement} */
let endGameDialog, howToPlayDialog;

// Buttons used for opening and/or closing dialogs
/** @type {HTMLButtonElement} */
let playAgainButton, howToPlayButton, closeHowToPlayButton;

// Close How to Play button container
/** @type {HTMLDivElement} */
let closeHowToPlayButtonContainer;

// Buttons for navigating the How to Play dialog
/** @type {HTMLButtonElement} */
let aboutButton, placingShipsButton, firingShotsButton, takingTurnsButton;

// Content inside How to Play dialog
let howToPlayContent, howToPlayContentContainer;

// Boards inside the endGameDialog
/** @type {HTMLDivElement} */
let player1EndBoard;
/** @type {HTMLDivElement} */
let player2EndBoard;

// Shot statistics inside endGameDialog
/** @type {HTMLDivElement} */
let shotStatsPlayer1;
/** @type {HTMLSpanElement} */
let shotsSpanPlayer1;
/** @type {HTMLSpanElement} */
let hitsSpanPlayer1;
/** @type {HTMLSpanElement} */
let missesSpanPlayer1;
/** @type {HTMLSpanElement} */
let hitPercentSpanPlayer1;
/** @type {HTMLSpanElement} */
let hitsToWinSpanPlayer1;

/** @type {HTMLDivElement} */
let shotStatsPlayer2;
/** @type {HTMLSpanElement} */
let shotsSpanPlayer2;
/** @type {HTMLSpanElement} */
let hitsSpanPlayer2;
/** @type {HTMLSpanElement} */
let missesSpanPlayer2;
/** @type {HTMLSpanElement} */
let hitPercentSpanPlayer2;
/** @type {HTMLSpanElement} */
let hitsToWinSpanPlayer2;

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
    // End Game Dialog
    endGameDialog = document.querySelector("#endGameDialog");
    playAgainButton = document.querySelector("#playAgainButton");
    player1EndBoard = document.querySelector("#endGameDialog #playerStatsContainer #player1Stats .board");
    player2EndBoard = document.querySelector("#endGameDialog #playerStatsContainer #player2Stats .board");

    shotStatsPlayer1 = document.querySelector("#endGameDialog #playerStatsContainer #player1Stats .shotStats");
    shotsSpanPlayer1 = document.querySelector("#endGameDialog #playerStatsContainer #player1Stats .shotStats .shotsP span");
    hitsSpanPlayer1 = document.querySelector("#endGameDialog #playerStatsContainer #player1Stats .shotStats .hitsMissesP .hits");
    missesSpanPlayer1 = document.querySelector("#endGameDialog #playerStatsContainer #player1Stats .shotStats .hitsMissesP .misses");
    hitPercentSpanPlayer1 = document.querySelector("#endGameDialog #playerStatsContainer #player1Stats .shotStats .hitPercentP span");
    hitsToWinSpanPlayer1 = document.querySelector("#endGameDialog #playerStatsContainer #player1Stats .shotStats .shotsToWinP span");

    shotStatsPlayer2 = document.querySelector("#endGameDialog #playerStatsContainer #player2Stats .shotStats");
    shotsSpanPlayer2 = document.querySelector("#endGameDialog #playerStatsContainer #player2Stats .shotStats .shotsP span");
    hitsSpanPlayer2 = document.querySelector("#endGameDialog #playerStatsContainer #player2Stats .shotStats .hitsMissesP .hits");
    missesSpanPlayer2 = document.querySelector("#endGameDialog #playerStatsContainer #player2Stats .shotStats .hitsMissesP .misses");
    hitPercentSpanPlayer2 = document.querySelector("#endGameDialog #playerStatsContainer #player2Stats .shotStats .hitPercentP span");
    hitsToWinSpanPlayer2 = document.querySelector("#endGameDialog #playerStatsContainer #player2Stats .shotStats .shotsToWinP span");

    // How to Play dialog
    howToPlayButton = document.querySelector("#howToPlayButton");
    howToPlayDialog = document.querySelector("#howToPlayDialog");
    closeHowToPlayButton = document.querySelector("#howToPlayDialog #closeHowToPlayButtonContainer #closeHowToPlayButton");
    closeHowToPlayButtonContainer = document.querySelector("#howToPlayDialog #closeHowToPlayButtonContainer");

    aboutButton = document.querySelector("#howToPlayDialog #buttonContainer #about");
    firingShotsButton = document.querySelector("#howToPlayDialog #buttonContainer #firing");
    placingShipsButton = document.querySelector("#howToPlayDialog #buttonContainer #placing");
    takingTurnsButton = document.querySelector("#howToPlayDialog #buttonContainer #turns");

    howToPlayContentContainer = document.querySelector("#howToPlayDialog #contentContainer");
    howToPlayContent = document.querySelector("#howToPlayDialog #contentContainer #content");

    // Boards
    board1Element = document.querySelector("#board1");
    board2Element = document.querySelector("#board2");

    // Select X length ship buttons
    select2LengthShipButton = document.querySelector("#select2LengthShipButton");
    select3LengthShipButton = document.querySelector("#select3LengthShipButton");
    select4LengthShipButton = document.querySelector("#select4LengthShipButton");
    select5LengthShipButton = document.querySelector("#select5LengthShipButton");

    select2LengthShipSpan = document.querySelector("#select2LengthShipSpan");
    select3LengthShipSpan = document.querySelector("#select3LengthShipSpan");
    select4LengthShipSpan = document.querySelector("#select4LengthShipSpan");
    select5LengthShipSpan = document.querySelector("#select5LengthShipSpan");

    // Swap-player-process buttons
    hideBoardsButton = document.querySelector("#hideBoardsButton");
    swapPlayersButton = document.querySelector("#swapPlayersButton");
    revealBoardsButton = document.querySelector("#revealBoardsButton");
}

function getHowToPlayDialog() {
    return howToPlayDialog;
}

function getHowToPlayButton() {
    return howToPlayButton;
}

function getCloseHowToPlayButton() {
    return closeHowToPlayButton;
}

function getAboutButton() {
    return aboutButton;
}

function getPlacingShipsButton() {
    return placingShipsButton;
}

function getFiringShotsButton() {
    return firingShotsButton;
}

function getTakingTurnsButton() {
    return takingTurnsButton;
}

function getHowToPlayContentContainer() {
    return howToPlayContentContainer;
}

function getHowToPlayContent() {
    return howToPlayContent;
}

function getEndGameDialog() {
    return endGameDialog;
}

function getPlayer1EndBoard() {
    return player1EndBoard;
}

function getPlayer2EndBoard() {
    return player2EndBoard;
}

function getShotsStatsPlayer1() {
    return shotStatsPlayer1;
}

function getShotsSpanPlayer1() {
    return shotsSpanPlayer1;
}

function getHitsSpanPlayer1() {
    return hitsSpanPlayer1;
}

function getMissesSpanPlayer1() {
    return missesSpanPlayer1;
}

function getHitPercentSpanPlayer1() {
    return hitPercentSpanPlayer1;
}

function getHitsToWinSpanPlayer1() {
    return hitsToWinSpanPlayer1;
}

function getShotsStatsPlayer2() {
    return shotStatsPlayer2;
}

function getShotsSpanPlayer2() {
    return shotsSpanPlayer2;
}

function getHitsSpanPlayer2() {
    return hitsSpanPlayer2;
}

function getMissesSpanPlayer2() {
    return missesSpanPlayer2;
}

function getHitPercentSpanPlayer2() {
    return hitPercentSpanPlayer2;
}

function getHitsToWinSpanPlayer2() {
    return hitsToWinSpanPlayer2;
}

function getPlayAgainButton() {
    return playAgainButton;
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

export {initializeUIState, getBoard1Element, getBoard2Element, getHideBoardsButton, getRevealBoardsButton, getSwapPlayersButton, getSelect2LengthShipButton, getSelect3LengthShipButton, getSelect4LengthShipButton, getSelect5LengthShipButton, getSelect2LengthShipSpan, getSelect3LengthShipSpan, getSelect4LengthShipSpan, getSelect5LengthShipSpan, getCurrentlySelectedXLengthShipButtonID, setCurrentlySelectedXLengthShipButton, getEndGameDialog, getPlayAgainButton, getPlayer1EndBoard, getPlayer2EndBoard, getHitPercentSpanPlayer1, getHitPercentSpanPlayer2, getHitsSpanPlayer1, getHitsSpanPlayer2, getMissesSpanPlayer1, getMissesSpanPlayer2, getShotsSpanPlayer1, getShotsSpanPlayer2, getHitsToWinSpanPlayer1, getHitsToWinSpanPlayer2, getShotsStatsPlayer1, getShotsStatsPlayer2, getCloseHowToPlayButton, getHowToPlayButton, getHowToPlayDialog, getAboutButton, getFiringShotsButton, getPlacingShipsButton, getTakingTurnsButton, getHowToPlayContent, getHowToPlayContentContainer}