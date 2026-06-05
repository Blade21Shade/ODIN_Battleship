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
    REVEAL_BOARDS: "revealBoards",
    SELECT5: "select5LengthShipButton",
    SELECT4: "select4LengthShipButton",
    SELECT3: "select3LengthShipButton",
    SELECT2: "select2LengthShipButton",
    ABOUT: "about",
    PLACING_SHIPS: "placingShips",
    FIRING_SHOTS: "firingShots",
    TAKING_TURNS: "takingTurns"
});

/**
 * Holds the valid classes that can be added to cells
 */
const VALID_CELL_CLASSES = Object.freeze({
    FRIEND: 'friend',
    FOE: 'foe',
    HIT: 'hit',
    MISS: 'miss',
    SHIP: 'ship',
    PLACE_SHIP: 'placeShip'
});

const DOMManipulation = {
    FRIEND_OR_FOE,
    BOARD_NUMBER,
    BUTTON_NAMES,
    VALID_CELL_CLASSES,

    /**
     * Gets a button from the DOM with the given name
     * @param {BUTTON_NAMES} buttonName The name of the button to grab 
     * @returns The DOM element for that button
     */
    grabButtonElement(buttonName) {
        /** @type {HTMLButtonElement} */
        let btnEle;
        switch(buttonName) {
            case BUTTON_NAMES.HIDE_BOARDS:
                btnEle = UIState.getHideBoardsButton();
                break;
            case BUTTON_NAMES.SWAP_PLAYERS:
                btnEle = UIState.getSwapPlayersButton();
                break;
            case BUTTON_NAMES.REVEAL_BOARDS:
                btnEle = UIState.getRevealBoardsButton();
                break;
            case BUTTON_NAMES.SELECT5:
                btnEle = UIState.getSelect5LengthShipButton();
                break;
            case BUTTON_NAMES.SELECT4:
                btnEle = UIState.getSelect4LengthShipButton();
                break;
            case BUTTON_NAMES.SELECT3:
                btnEle = UIState.getSelect3LengthShipButton();
                break;
            case BUTTON_NAMES.SELECT2:
                btnEle = UIState.getSelect2LengthShipButton();
                break;
            default: // Invalid name given
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
        // Header buttons - at the moment they don't need adjustments on initialization, but I'm keeping these calls here in case they do in the future
        // let select5LengthShipButton = UIState.getSelect5LengthShipButton();
        // let select4LengthShipButton = UIState.getSelect4LengthShipButton();
        // let select3LengthShipButton = UIState.getSelect3LengthShipButton();
        // let select2LengthShipButton = UIState.getSelect2LengthShipButton();

        // Footer buttons
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
     * Adds the 'selected' class to the button matching the given buttonName
     * @param {BUTTON_NAMES} buttonName The name of the button as defined in BUTTON_NAMES to add the class to
     */
    addSelectedClassToButton(buttonName) {
        let btn = grabButtonElement(buttonName);
        btn.classList.add('selected');
    }, 

    /**
     * Removes the 'selected' class from the button matching the given buttonName
     * @param {BUTTON_NAMES} buttonName The name of the button as defined in BUTTON_NAMES to remove the class from
     */
    removeSelectedClassFromButton(buttonName) {
        let btn = grabButtonElement(buttonName);
        btn.classList.remove('selected');
    }, 

    /**
     * Increments the value of the span of a 'select ship length' button
     * @param {Number} length The length corresponding to the span to increment
     */
    incrementSelectLengthSpanValue(length) {
        let span = getSpanFromUIState(length);
        let spanNum = Number(span.innerText);
        if (isNaN(spanNum)) {
            throw new error("Span value not a number: Invalid game state");
        }

        span.innerText = ++spanNum;
    },

    /**
     * Decrements the value of the span of a 'select ship length' button
     * @param {Number} length The length corresponding to the span to decrement
     */
    decrementSelectLengthSpanValue(length) {
        let span = getSpanFromUIState(length);
        let spanNum = Number(span.innerText);
        if (isNaN(spanNum)) {
            throw new error("Span value not a number: Invalid game state");
        }

        span.innerText = --spanNum;
    },

    /**
     * Initializes span values
     */
    initializeSpanValues() {
        let span2 = getSpanFromUIState(2);
        let span3 = getSpanFromUIState(3);
        let span4 = getSpanFromUIState(4);
        let span5 = getSpanFromUIState(5);

        span2.innerText = 1;
        span3.innerText = 2;
        span4.innerText = 1;
        span5.innerText = 1;
    },

    /**
     * Gets a span from the DOM
     * @param {Number} length The length corresponding to the span to retrieve, can only be 2-5
     * @returns The span
     * @throws If a span cannot be found for the given length
     */
    getSpanFromUIState(length) {
        let span;
        switch(length) {
            case 2:
                span = UIState.getSelect2LengthShipSpan();
                break;
            case 3:
                span = UIState.getSelect3LengthShipSpan();
                break;
            case 4:
                span = UIState.getSelect4LengthShipSpan();
                break;
            case 5:
                span = UIState.getSelect5LengthShipSpan();
                break;
            default:
                throw new Error("Invalid length given, only lengths of 2-5 are allowed");
        }

        return span;
    },

    /**
     * Switches the content inside the How to Play dialog to the content associated with that button
     * @param {BUTTON_NAMES} clickedButton The button that was clicked to cause the content switch
     * - Only ABOUT, PLACING_SHIPS, FIRING_SHOTS, and TAKING_TURNS are valid
     * @throws If clickedButton isn't a valid value
     */
    switchHowToPlayDialogContents(clickedButton) {
        let content = UIState.getHowToPlayContent();
        switch(clickedButton) {
            case BUTTON_NAMES.ABOUT:
                content.innerText = `About`;
                break;
            case BUTTON_NAMES.PLACING_SHIPS:
                content.innerText = `Placing Ships`;
                break;
            case BUTTON_NAMES.FIRING_SHOTS:
                content.innerText = `Firing Shots`;
                break;
            case BUTTON_NAMES.TAKING_TURNS:
                content.innerText = `Taking turns`;
                break;
            default:
                throw new Error("Invalid name given: Must be DOMManipulation's BUTTON_NAMES' ABOUT, PLACING_SHIPS, FIRING_SHOTS, or TAKING_TURNS");
        }
    },

    /**
     * Marks cells on the DOM board for boardNumber by entries in the board array with the "hit", "miss", "friend", or "foe" classes - Can be called before or after fillBoardElementShips
     * @param {[[number]]} boardArray The 2D array to parse to place shots on the board; entries should be 1 for hit, 0 for not-shot-at, -1 for miss; the array should be 10x10
     * @param {FRIEND_OR_FOE} friendOrFoe Whether this is for the friend or foe board
     * @param {HTMLDivElement} boardElement The board element to fill with shots
     */
    fillBoardElementShots(boardArray, friendOrFoe, boardElement) {
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
     * @param {HTMLDivElement} boardElement The board element to be filled with ships
     */
    fillBoardElementShips(positionsOfShips, friendOrFoe, boardElement) {
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
     * @param {HTMLDivElement} board1 The board to fill with shots and ships, the 'friend' board
     * @param {HTMLDivElement} board2 The board to fill only shots, the 'foe' board
     */
    fillBoardElementsAll(friendShipsCoordinatesArray, friendShotsCoordinatesArray, foeShotsCoordinatesArray, board1, board2) {
        // Friend ships and shots
        DOMManipulation.fillBoardElementShots(friendShotsCoordinatesArray, DOMManipulation.FRIEND_OR_FOE.FRIEND, board1);
        DOMManipulation.fillBoardElementShips(friendShipsCoordinatesArray, DOMManipulation.FRIEND_OR_FOE.FRIEND, board1);

        // Foe shots
        DOMManipulation.fillBoardElementShots(foeShotsCoordinatesArray, DOMManipulation.FRIEND_OR_FOE.FOE, board2);
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
     * Adds the placeShip class to cells around the event.target
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
     * Removes the placeShip class from cells around the event.target
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
     * Adds a class to a cell on the board corresponding to friendOrFoe
     * - This will only add classes to cells that haven't been altered yet
     * - EG: Cells like 'friend ship' and 'foe hit' won't be affected if this function would target them
     * - Will not add the 'ship' class to cells on the Foe board
     * @param {Number} cellNumber The cell number to add the class to
     * @param {DOMManipulation.VALID_CELL_CLASSES} classToAdd The class to add 
     * @param {DOMManipulation.FRIEND_OR_FOE} friendOrFoe Which board the cell is located on
     */
    addClassToCell(cellNumber, classToAdd, friendOrFoe) {
        // Get board based on friendOrFoe
        DOMManipulation.friendOrFoeValidityCheck(friendOrFoe);
        let board;
        if (friendOrFoe === DOMManipulation.FRIEND_OR_FOE.FRIEND) {
            board = UIState.getBoard1Element();
        } else {
            board = UIState.getBoard2Element();
        }

        // Verify the given class is a valid class
        if (Object.values(DOMManipulation.VALID_CELL_CLASSES).includes(classToAdd) === false) {
            throw new Error("Invalid class name given; see VALID_CLASSES for valid names");
        }

        // Ensure cell is within valid range
        if (cellNumber < 0 || cellNumber > 99) {
            throw new Error("Cell number out of bounds, only 0-99 are valid");
        }

        let cell = board.children[cellNumber];
        // Only add if the cell is 'clean'
        if (cell.className === "cell friend" || cell.className === "cell foe") {
            
            // Ensure the 'ship' class isn't added to cells on the foeBoard
            if (classToAdd === DOMManipulation.VALID_CELL_CLASSES.SHIP && cell.className === "cell foe") {
                return;
            }

            DOMManipulation.clearCellClassList(cell);
            cell.classList.add(classToAdd);
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
export const {initializeBoardElements, resetBoardElements, initializePlayerButtons, fillBoardElementShots, fillBoardElementShips, grabButtonElement, enableButton, disableButton, enablePlaceShipHandlers, disablePlaceShipHandlers, addPlaceShipClassHandler, removePlaceShipClassHandler, wheelEventHandler, fillBoardElementsAll, addShipClassToIDList, removeShipClassFromIDList, resetCellClassList, friendOrFoeValidityCheck, incrementSelectLengthSpanValue, decrementSelectLengthSpanValue, addSelectedClassToButton, removeSelectedClassFromButton, getSpanFromUIState, initializeSpanValues, addClassToCell, switchHowToPlayDialogContents} = DOMManipulation;

export {FRIEND_OR_FOE, BOARD_NUMBER, BUTTON_NAMES, VALID_CELL_CLASSES} // Named export the Enums as well

// Default export the DOMManipulation object
export default DOMManipulation;