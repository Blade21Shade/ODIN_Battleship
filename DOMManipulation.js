import * as UIState from "./UIState.js"
import * as Tools from "./Tools.js"

/**
 * Holds the values that functions expect in friendOrFoe arguments
 */
const FRIEND_OR_FOE = Object.freeze({
    FRIEND: "friend",
    FOE: "foe"
});

/**
 * Holds the values that functions expect in boardNumber arguments
 */
const BOARD_NUMBER = Object.freeze({
    ONE: 1,
    TWO: 2
});

/**
 * Holds the values functions expect in buttonName arguments
 */
const BUTTON_NAMES = Object.freeze({
    SWAP_PLAYERS: "swapPlayers",
    HIDE_BOARDS: "hideBoards",
    REVEAL_BOARDS: "revealBoards"
});

const DOMManipulation = {
    FRIEND_OR_FOE,
    BOARD_NUMBER,
    BUTTON_NAMES,

    /**
     * Gets one of the board elements from the DOM
     * @param {BOARD_NUMBER} boardNumber Which board to grab, 1 or 2
     * @returns The DOM element for that board
     */
    grabBoardElement(boardNumber) {
        /** @type {HTMLDivElement} */
        let boardEle;
        if (boardNumber === BOARD_NUMBER.ONE) {
            boardEle = UIState.getBoard1Element();
        } else if (boardNumber === BOARD_NUMBER.TWO) {
            boardEle = UIState.getBoard2Element();
        } else {
            throw new Error("Invalid board number given, must be 1 or 2");
        }
        return boardEle;
    },


    /**
     * Gets a button from the DOM with the given name
     * @param {BUTTON_NAMES} buttonName The name of the button to grab 
     * @returns The DOM element for that button
     */
    grabButtonElement(buttonName) {
        /** @type {HTMLButtonElement} */
        let btnEle;
        if (buttonName === BUTTON_NAMES.HIDE_BOARDS) {
            btnEle = UIState.getHideBoardsButton();
        } else if (buttonName === BUTTON_NAMES.SWAP_PLAYERS) {
            btnEle = UIState.getSwapPlayersButton();
        } else if (buttonName === BUTTON_NAMES.REVEAL_BOARDS) {
            btnEle = UIState.getRevealBoardsButton();
        } else {
            throw new Error("Invalid button name given");
        }

        return btnEle;
    },

    /**
     * Fills the board elements with cells
     * - cells have an ID for position referencing
     * - cells have a class based on their parent board; "friend" for board1, "foe" for board2
     * @throws Throws an error if the boards have already been initialized
     */
    initializeBoardElements() {
        /** @type {HTMLDivElement} */
        let board1 = UIState.getBoard1Element();
        
        /** @type {HTMLDivElement} */
        let board2 = UIState.getBoard2Element();
        
        // If already initialized, throw an error
        if (board1.childElementCount !== 0 || board2.childElementCount !== 0) { // These should never have different numbers of children, but for safety check both
            throw new Error("Boards previously initialized, cannot initialize again");
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
    },

    /**
     * Resets board elements to their initialization state
     * @throws Throws an error if the boards haven't been initialized beforehand
     */
    resetBoardElements() {
        let board1 = UIState.getBoard1Element();
        let board2 = UIState.getBoard2Element();

        // If the boards haven't been initialized, throw an error
        if (board1.childElementCount !== 100 || board2.childElementCount !== 100) {  // These should never have different numbers of children, but for safety check both
            throw new Error("Boards must be initialized before they can be reset");
        }

        for (let i = 0; i < 100; i++) {
            DOMManipulation.resetCellClassList(board1.children[i], FRIEND_OR_FOE.FRIEND);
            DOMManipulation.resetCellClassList(board2.children[i], FRIEND_OR_FOE.FOE);
        }
    },

    /**
     * Sets the player buttons to their original state
     */
    initializePlayerButtons() {
        let swapButton = UIState.getSwapPlayersButton();
        let hideButton = UIState.getHideBoardsButton();
        let revealButton = UIState.getRevealBoardsButton();

        swapButton.disabled = true;
        hideButton.disabled = true;
        revealButton.disabled = true;

        hideButton.title = "Click this after you've fired a shot to make all cells ocean";
        swapButton.title = "Click this to swap the boards so the next player can take their turn";
        revealButton.title = "Click this to reveal your board so you can fire a shot at your opponent";
    },

    /**
     * Enables a button
     * @param {BUTTON_NAMES} buttonName The name of the button to enable 
     */
    enableButton(buttonName) {
        let btn = grabButtonElement(buttonName);
        btn.disabled = false;
    },

    /**
     * Disables a button
     * @param {BUTTON_NAMES} buttonName The name of the button to disable 
     */
    disableButton(buttonName) {
        let btn = grabButtonElement(buttonName);
        btn.disabled = true;
    },

    /**
     * Marks cells on the DOM board for boardNumber by entries in the board array with the "hit", "miss", "friend", or "foe" classes - Can be called before or after fillBoardElementShips
     * @param {[[number]]} boardArray The 2D array to parse to place shots on the board; entries should be 1 for hit, 0 for not-shot-at, -1 for miss; the array should be 10x10
     * @param {FRIEND_OR_FOE} friendOrFoe Whether this is for the friend or foe board
     * @param {BOARD_NUMBER} boardNumber The board number for the DOM board which should be affected
     */
    fillBoardElementShots(boardArray, friendOrFoe, boardNumber) {
        const boardElement = grabBoardElement(boardNumber);
        DOMManipulation.friendOrFoeValidityCheck(friendOrFoe);

        // Make sure boardArray is the right size
        if (boardArray.length != 10) {
            throw new Error("boardArray has invalid number of rows");
        }

        for (let i = 0; i < 10; i++) {
            if (boardArray[i].length != 10) {
                throw new Error(`row ${i} in boardArray is an invalid size`);
            }
        }

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
                    case 0: // Not shot at
                        if (friendOrFoe === FRIEND_OR_FOE.FRIEND) {
                            if (!thisCell.classList.contains("ship")) { // If this is a ship space, keep the ship
                                thisCell.classList.toggle("friend");
                            } 
                        } else {
                            thisCell.classList.add("foe");
                        }
                        break;
                    default: // This would be an error state, so throw
                        throw new Error("Invalid hit-value in argument boardArray");
                }
                cellNumber++;
            }
        }
    },

    /**
     * Marks cells on the DOM board for boardNumber by entries in positionsOfShips with the the "ship" class - Can be called before or after fillBoardElementShots
     * @param {[[[number, number]]]} positionsOfShips A 3D array hold coordinates of ships; the outer array holds ships; each ship holds an array of coordinates; each coordinate is a pair of numbers
     * @param {FRIEND_OR_FOE} friendOrFoe Whether this is for the friend or foe board - NOTE: This method will only process when "friend" is given
     * @param {BOARD_NUMBER} boardNumber The board number for the DOM board which should be affected
     */
    fillBoardElementShips(positionsOfShips, friendOrFoe, boardNumber) {
        const boardElement = grabBoardElement(boardNumber);
        DOMManipulation.friendOrFoeValidityCheck(friendOrFoe);

        // Only fill ships on the friend board
        if (friendOrFoe === FRIEND_OR_FOE.FOE) {
            return;
        }

        // Find which cells to mark - check that positions are valid
        let cellNumbersToMark = [];
        for (let i = 0; i < positionsOfShips.length; i++) {
            let aShipsPositions = positionsOfShips[i];
            for (const position of aShipsPositions) {
                let cellNumber = Tools.createIDNumberFromCoordinate(position);

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
                DOMManipulation.clearCellClassList(cell);
                cell.classList.toggle("ship");
            }
        }
    },

    /**
     * 
     * @param {[[[number, number]]]} friendShipsCoordinatesArray An array of friend ship's coordinates, correlates to fillBoardElementShips()'s positionsOfShips argument
     * @param {[[number]]} friendShotsCoordinatesArray An array of friend shots, correlates to fillBoardElementShots()'s boardArray
     * @param {[[number]]} foeShotsCoordinatesArray An array of foe shots, correlates to fillBoardElementShots()'s boardArray
     */
    fillBoardElementsAll(friendShipsCoordinatesArray, friendShotsCoordinatesArray, foeShotsCoordinatesArray) {
        // Friend ships and shots
        DOMManipulation.fillBoardElementShots(friendShotsCoordinatesArray, DOMManipulation.FRIEND_OR_FOE.FRIEND, 1);
        DOMManipulation.fillBoardElementShips(friendShipsCoordinatesArray, DOMManipulation.FRIEND_OR_FOE.FRIEND, 1);

        // Foe shots
        DOMManipulation.fillBoardElementShots(foeShotsCoordinatesArray, DOMManipulation.FRIEND_OR_FOE.FOE, 2);
    },

    /**
     * Add the placeShip handlers to the "friend" board
     */
    enablePlaceShipHandlers() {
        let board1Element = UIState.getBoard1Element();
        board1Element.addEventListener("mouseover", addPlaceShipClassHandler);
        board1Element.addEventListener("mouseout", removePlaceShipClassHandler);
        board1Element.addEventListener("wheel", wheelEventHandler);
    },

    /**
     * Removes the placeShip handlers from the "friend" board
     */
    disablePlaceShipHandlers() {
        let board1Element = UIState.getBoard1Element();
        board1Element.removeEventListener("mouseover", addPlaceShipClassHandler);
        board1Element.removeEventListener("mouseout", removePlaceShipClassHandler);
        board1Element.removeEventListener("wheel", wheelEventHandler);
    },

    /**
     * Adds the placeShip class to cells around the event.target; this works alongside Tools' searchDirection and additionalToGetEachDirection variables
     * @param {MouseEvent} event A mouseover event of board1; used to get the cell that was moused over
     */
    addPlaceShipClassHandler(event) {
        let cell = event.target;

        if (cell.className === "cell friend") { // Make sure cells with the 'ship' class remain unaffected 
            let idString = cell.id;
            let idNumber = Tools.getIDNumberFromIDString(idString);
            let idList = Tools.createIDListFromIDNumber(idNumber);

            for (const id of idList) {
                let thisCell = document.querySelector(`#board1-cell${id}`);
                thisCell.classList.add("placeShip");
            }
        }
    },

    /**
     * Removes the placeShip class from cells around the event.target; this works alongside Tools' searchDirection and additionalToGetEachDirection variables
     * @param {MouseEvent} event A mouseout event of board1; used to get the cell that was moused out
     */
    removePlaceShipClassHandler(event) {
        let cell = event.target;

        if (cell.classList.contains("placeShip")) {
            let idString = cell.id;
            let idNumber = Tools.getIDNumberFromIDString(idString);
            let idList = Tools.createIDListFromIDNumber(idNumber);

            for (const id of idList) {
                let thisCell = document.querySelector(`#board1-cell${id}`);
                thisCell.classList.remove("placeShip");
            }
        }
    },

    /**
     * Switches the placement direction of ships so users can place them horizontally or vertically
     * @param {WheelEvent} event The wheel event from board1
     */
    wheelEventHandler(event) {
        DOMManipulation.removePlaceShipClassHandler(event);
        Tools.switchSearchDirection();
        DOMManipulation.addPlaceShipClassHandler(event);
    },

    /**
     * Adds the 'ship' class to cells with IDs in idList
     * This method is meant to be used when users initially place ships to be more efficient than reloading the entire DOM board every ship placement. 
     * @param {[[number, number]]} idList The idList of cells to add the ship class to
     */
    addShipClassToIDList(idList) {
        for (const id of idList) {
            if (id < 0 || id > 99) {
                continue;
            }
            let cell = document.querySelector(`#board1-cell${id}`);
            cell.classList.remove("friend");
            cell.classList.add("ship");
        }
    },

    /**
     * Removes the 'ship' class from cells with IDs in idList.
     * This method is meant to be used when users initially place ships to be more efficient than reloading the entire DOM board every ship placement. 
     * @param {[[number, number]]} idList The idList of cells to remove the ship class from
     */
    removeShipClassFromIDList(idList) {
        for (const id of idList) {
            if (id < 0 || id > 99) {
                continue;
            }
            let cell = document.querySelector(`#board1-cell${id}`);
            cell.classList.remove("ship");
            cell.classList.add("friend");
        }
    },

    /**
     * Removes all non-cell classes from a cell
     * @param {Element} cell The cell to remove classes from
     */
    clearCellClassList(cell) {
        cell.className = "cell";
    },

    /**
     * Removes all non-cell classes from a cell, then adds the "friend" or "foe" class based on friendOrFoe 
     * @param {Element} cell The cell to reset classes for 
     * @param {FRIEND_OR_FOE} friendOrFoe What board this cell belongs to 
     */
    resetCellClassList(cell, friendOrFoe) {
        DOMManipulation.friendOrFoeValidityCheck(friendOrFoe);
        cell.className = "cell";
        if (friendOrFoe === FRIEND_OR_FOE.FRIEND) {
            cell.classList.add("friend");
        } else {
            cell.classList.add("foe");
        }
    },

    /**
     * Checks whether friendOrFoe matches either entry in FRIEND_OR_FOE
     * @param {FRIEND_OR_FOE} friendOrFoe The string to check
     * @throws If friendOrFoe doesn't match a value in FRIEND_OR_FOE
     */
    friendOrFoeValidityCheck(friendOrFoe) {
        if (friendOrFoe !== FRIEND_OR_FOE.FRIEND && friendOrFoe !== FRIEND_OR_FOE.FOE) {
            throw new Error("Invalid friend or foe option given")
        }
    }

}

// Exporting all the things inside the object by using the destructure syntax
// Luckily, the order doesn't matter, JS does: thing = Object.thing
export const {initializeBoardElements, resetBoardElements, initializePlayerButtons, fillBoardElementShots, fillBoardElementShips, grabBoardElement, grabButtonElement, enableButton, disableButton, enablePlaceShipHandlers, disablePlaceShipHandlers, addPlaceShipClassHandler, removePlaceShipClassHandler, wheelEventHandler, fillBoardElementsAll, addShipClassToIDList, removeShipClassFromIDList, resetCellClassList, friendOrFoeValidityCheck} = DOMManipulation;

export {FRIEND_OR_FOE, BOARD_NUMBER, BUTTON_NAMES} // Named export the Enums as well

// Default export the DOMManipulation object
export default DOMManipulation;