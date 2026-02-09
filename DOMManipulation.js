/**
 * Holds the values that functions expect in friendOrFoe arguments
 */
const FRIEND_OR_FOE = {
    FRIEND: "friend",
    FOE: "foe"
}

/**
 * Holds the values that functions expect in boardNumber arguments
 */
const BOARD_NUMBER = {
    ONE: 1,
    TWO: 2
}

/**
 * Holds the values functions expect in buttonName arguments
 */
const BUTTON_NAMES = {
    SWAP_PLAYERS: "swapPlayers",
    HIDE_BOARDS: "hideBoards"
}

Object.freeze(FRIEND_OR_FOE);
Object.freeze(BOARD_NUMBER);
Object.freeze(BUTTON_NAMES);

/**
 * Gets one of the board elements from the DOM
 * @param {BOARD_NUMBER} boardNumber Which board to grab, 1 or 2
 * @returns The DOM element for that board
 */
function grabBoardElement(boardNumber) {
    let boardEle;
    if (boardNumber === BOARD_NUMBER.ONE) {
        boardEle = document.querySelector("#board1");
    } else if (boardNumber === BOARD_NUMBER.TWO) {
        boardEle = document.querySelector("#board2");
    } else {
        throw new Error("Invalid board number given, must be 1 or 2");
    }
    return boardEle;
}

function grabPlayerButton(buttonName) {
    let btnEle;
    if (buttonName === BUTTON_NAMES.HIDE_BOARDS) {
        btnEle = document.querySelector("#hideBoardsButton");
    } else if (buttonName === BUTTON_NAMES.SWAP_PLAYERS) {
        btnEle = document.querySelector("#swapPlayersButton");
    }

    return btnEle;
}

/**
 * Fills the board elements with cells - cells have an ID and if a child of board1 the "friend" class, or "foe" for board2
 */
function initializeBoardElements() {
    let board1 = grabBoardElement(BOARD_NUMBER.ONE);
    let board2 = grabBoardElement(BOARD_NUMBER.TWO);
    
    if (board1.childElementCount !== 0 || board2.childElementCount !== 0) {
        alert("Boards already initialized");
        return;
    }

    const cell = document.createElement("div");
    cell.classList.toggle("cell");

    for (let i = 0; i < 100; i++) {
        let clone = cell.cloneNode();
        clone.classList.toggle("friend");
        clone.id = `board1-cell${i}`;
        board1.appendChild(clone);

        clone = cell.cloneNode();
        clone.classList.toggle("foe");
        clone.id = `board2-cell${i}`;
        board2.appendChild(clone);
    }
}

function initializePlayerButtons() {
    let swapButton = grabPlayerButton(BUTTON_NAMES.SWAP_PLAYERS);
    let hideButton = grabPlayerButton(BUTTON_NAMES.HIDE_BOARDS);

    swapButton.disabled = true;
    hideButton.disabled = true;

    hideButton.title = "Click this after you've fired a shot to make all cells ocean, this way the other player can't see your board";
    swapButton.title = "Click this once you are in front of the computer so you can unhide your board\nThis is to prevent accidentally double clicking the hide button"
}

function swapHideButtonText(hideOrUnhide) {
    let hideButton = grabPlayerButton(BUTTON_NAMES.HIDE_BOARDS);

    if (hideOrUnhide === "hide") {
        hideButton.innerText = "Hide boards";
        hideButton.title = "Click this after you've fired a shot to make all cells ocean, this way the other player can't see your board";

    } else if (hideOrUnhide === "unhide") {
        hideButton.innerText = "Un-hide boards";
        hideButton.title = "Click this to reveal your board so you can fire a shot at your opponent";
    }
}

function enableButton(buttonName) {
    let btn = grabPlayerButton(buttonName);
    btn.disabled = false;
}

function disableButton(buttonName) {
    let btn = grabPlayerButton(buttonName);
    btn.disabled = true;
}

/**
 * Resets each board's cells to only have the "cell" class and "friend" or "foe" class based on parent board
 */
function resetBoardElementsCells() {
    let board1 = grabBoardElement(BOARD_NUMBER.ONE);
    let board2 = grabBoardElement(BOARD_NUMBER.TWO);

    for (let i = 0; i < 100; i++) {
        resetCellClassList(board1.children[i], FRIEND_OR_FOE.FRIEND);
        resetCellClassList(board2.children[i], FRIEND_OR_FOE.FOE);
    }
}

/**
 * Marks cells on the DOM board for boardNumber by entries in the board array with the "hit", "miss", "friend", or "foe" classes - Can be called before or after fillBoardElementShips
 * @param {[[number]]} boardArray The 2D array to parse to place shots on the board; entries should be 1 for hit, 0 for not-shot-at, -1 for miss; the array should be 10x10
 * @param {FRIEND_OR_FOE} friendOrFoe Whether this is for the friend or foe board
 * @param {BOARD_NUMBER} boardNumber The board number for the DOM board which should be affected
 */
function fillBoardElementShots(boardArray, friendOrFoe, boardNumber) {
    const boardElement = grabBoardElement(boardNumber);
    friendOrFoeValidityCheck(friendOrFoe);

    // Fill each cell with the appropriate class
    let cellNumber = 0;
    for (let i = 0; i < 10; i++) {
        let row = boardArray[i];
        for (let j = 0; j < 10; j++) {
            let thisCell = boardElement.children[cellNumber];
            
            let hitVal = row[j];
            switch(hitVal) {
                case -1: // Miss
                    thisCell.classList.remove("friend", "foe");
                    thisCell.classList.toggle("miss");
                    break;
                case 1: // Hit
                    thisCell.classList.remove("friend", "foe");
                    thisCell.classList.toggle("hit");
                    break;
                default: // Not shot at
                    if (friendOrFoe === FRIEND_OR_FOE.FRIEND) {
                        if (!thisCell.classList.contains("ship")) { // If this is a ship space, keep the ship
                            thisCell.classList.toggle("friend");
                        } 
                    } else {
                        thisCell.classList.add("foe");
                    }
            }
            cellNumber++;
        }
    }
}

/**
 * Marks cells on the DOM board for boardNumber by entries in positionsOfShips with the the "ship" class - Can be called before or after fillBoardElementShots
 * @param {[[[number, number]]]} positionsOfShips A 3D array hold coordinates of ships; the outer array holds ships; each ship holds an array of coordinates; each coordinate is a pair of numbers
 * @param {FRIEND_OR_FOE} friendOrFoe Whether this is for the friend or foe board - NOTE: This function will only process when "friend" is given
 * @param {BOARD_NUMBER} boardNumber The board number for the DOM board which should be affected
 */
function fillBoardElementShips(positionsOfShips, friendOrFoe, boardNumber) {
    const boardElement = grabBoardElement(boardNumber);
    friendOrFoeValidityCheck(friendOrFoe);

    // Only fill ships on the friend board
    if (friendOrFoe === FRIEND_OR_FOE.FOE) {
        return;
    }

    // Find which cells to mark - check that positions are valid
    let cellNumbersToMark = [];
    for (let i = 0; i < positionsOfShips.length; i++) {
        let aShipsPositions = positionsOfShips[i];
        for (const position of aShipsPositions) {
            let x = position[0];
            let y = position[1];

            /** Update the cell this coordinate belongs to
             * This assumes y starts at the top of the board, not the bottom
             * This is to be consistent with how arrays print with console.log: the first entry in the first array is in the top left of the print
             * This is also how children are added to the board, with the first being in the top left
             * Every 10 child elements is a new grid-row, by using the column position y and multiplying it by 10 we find which grid-row this coordinate belongs to
             * x is then used to find the offset within that row, which is the normal x position
             */
            let cellNumber = x + (y*10);

            if (cellNumber > 99 || cellNumber < 0) {
                throw new Error("Position outside of range for valid positions in shipPositionsArray")
            }

            cellNumbersToMark.push(cellNumber);
        }
    }

    // Actually mark cells
    for (const num of cellNumbersToMark) {
        let cell = boardElement.children[num];
            
        // Only clear non-hit cells
        if (!cell.classList.contains("hit")) {
            clearCellClassList(cell);
            cell.classList.toggle("ship");
        }
    }
}

/**
 * Removes all non-cell classes from a cell
 * @param {Element} cell The cell to remove classes from
 */
function clearCellClassList(cell) {
    cell.classList.remove("miss", "hit", "friend", "foe", "ship");
}

/**
 * Removes all non-cell classes from a cell, then adds the "friend" or "foe" class based on friendOrFoe 
 * @param {Element} cell The cell to reset classes for 
 * @param {FRIEND_OR_FOE} friendOrFoe What board this cell belongs to 
 */
function resetCellClassList(cell, friendOrFoe) {
    cell.classList.remove("miss", "hit", "friend", "foe", "ship");
    if (friendOrFoe === FRIEND_OR_FOE.FRIEND) {
        cell.classList.add("friend");
    } else {
        cell.classList.add("foe");
    }
}

/**
 * Checks whether friendOrFoe matches either entry in FRIEND_OR_FOE - if it doesn't match, throw an error
 * @param {FRIEND_OR_FOE} friendOrFoe The string to check
 */
function friendOrFoeValidityCheck(friendOrFoe) {
    if (friendOrFoe !== FRIEND_OR_FOE.FRIEND && friendOrFoe !== FRIEND_OR_FOE.FOE) {
        throw new Error("Invalid friend or foe option given")
    }
}

export {FRIEND_OR_FOE, BOARD_NUMBER, BUTTON_NAMES, initializeBoardElements, initializePlayerButtons, resetBoardElementsCells, fillBoardElementShots, fillBoardElementShips, grabBoardElement}