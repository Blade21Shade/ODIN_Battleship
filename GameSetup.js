/**
 * This file holds data and functions needed to setup the game, but not needed once the game has begun
 */

import * as self from "./GameSetup.js";
import DOMManipulation from "./DOMManipulation.js";
import * as GameState from "./GameState.js";
import * as UIState from "./UIState.js";
import * as Tools from "./Tools.js";

/**
 * The number of ships left to place for each ship length
 * - NOTE: Each index in the array is for the ship length 2 greater than it
 * - EG: [0] is for the 2-length ship
 * @type {[Number]}
 */
let numberOfShipsLeftToPlace = [0, 0, 0, 0];

/**
 * The max number of ships that can be placed for each ship length
 * - NOTE: Each index in the array is for the ship length 2 greater than it
 * - EG: [0] is for the 2-length ship
 * @type {[Number]}
 */
const MAX_NUMBER = [1, 2, 1, 1];

/**
 * Sets variables and the DOM to a state ready for ship placement for the current player
 * - This should be called once per player
 */
function initializeOrReset() {
    // Base values are the maximum number that can be placed
    numberOfShipsLeftToPlace = [...MAX_NUMBER];

    // Start the player with the 5-length ship selected to place
    DOMManipulation.addSelectedClassToButton(DOMManipulation.BUTTON_NAMES.SELECT5);
    UIState.setCurrentlySelectedXLengthShipButton(5);
    Tools.setWorkingShipLength(5);
}

/**
 * Returns the total number of ships left to place
 * @returns The sum of ships left to place
 */
function getNumberOfShipsLeftToPlace() {
    return numberOfShipsLeftToPlace[0] + numberOfShipsLeftToPlace[1] + numberOfShipsLeftToPlace[2] + numberOfShipsLeftToPlace[3];
}

/**
 * Returns the number of ships left to place for a ship of the given length
 * @param {Number} length The length of ship
 * @returns {Number} The number left to place
 */
function getNumberOfShipsToPlaceOfGivenLength(length) {
    let indexPos = convertLengthToIndexPosition(length);
    return numberOfShipsLeftToPlace[indexPos];
}

/**
 * Converts a given length to the associated index position for arrays that reference ship lengths in this file
 * - See arrays for relation of ship length to index position 
 * @param {Number} length The length of the ship
 * @returns The index position in the arrays for that length
 */
function convertLengthToIndexPosition(length) {
    let indexPos = length - 2;
    if (indexPos < 0 || indexPos > 3) {
        throw new Error("Invalid ship length given: Only lengths of 2-5 are allowed");
    }

    return indexPos;
}

/**
 * Increments the variable holding the number of ships left to place of the given length
 * - This should be called when a ship is removed from the board
 * @param {Number} lengthToIncrement The length of the ship, only lengths 1-4 are valid
 * @returns {Number} The updated number of ships left to place for the given length
 * @throws If the given length isn't one of the valid lengths (1-4)
 */
function incrementNumberOfShipsToPlaceOfLength(lengthToIncrement) {
    // Increment the number to place
    let indexPos = convertLengthToIndexPosition(lengthToIncrement);
    let numberLeftToPlace = ++numberOfShipsLeftToPlace[indexPos];
    let maxShipsForThisLength = MAX_NUMBER[indexPos];
    
    // Throw if the increment created an invalid state
    if (numberLeftToPlace > maxShipsForThisLength) {
        incrementThrow(lengthToIncrement, maxShipsForThisLength);
    }

    return numberLeftToPlace;
}

/**
 * Throws an error that the number of ships left to place of the given length cannot be incremented beyond the current maxValue
 * @param {Number} length The length of the ship
 * @param {Number} maxValue The maxValue for that ship length
 */
function incrementThrow(length, maxValue) {
    throw new Error(`Cannot increment the number of ships of length ${length} to be placed above ${maxValue}`);
}

/**
 * Decrement the variable holding the number of ships left to place of the given length
 * - This should be called when a ship is added to the board
 * @param {Number} lengthToDecrement The length of the ship, only lengths 1-4 are valid
 * @returns {Number} The updated number of ships left to place for the given length
 * @throws If the given length isn't one of the valid lengths (1-4)
 */
function decrementNumberOfShipsToPlaceOfLength(lengthToDecrement) {
    // Decrement the number to place
    let indexPos = convertLengthToIndexPosition(lengthToDecrement);
    let numberLeftToPlace = --numberOfShipsLeftToPlace[indexPos];

    // Throw if the decrement created an invalid state
    if (numberLeftToPlace < 0) {
        decrementThrow(lengthToDecrement);
    }

    return numberLeftToPlace;
}

/**
 * Throws an error that the number of ships left to place of the given length cannot be decremented below 0
 * @param {Number} length The length of the ship
 */
function decrementThrow(length) {
    throw new Error(`Cannot decrement the number of ships of length ${length} to be placed below 0`);
}

/**
 * Enables event listeners for the buttons used to select ship lengths when players are placing ships
 */
function enableSelectShipLengthButtonHandlers() {
    let length2 = UIState.getSelect2LengthShipButton();
    let length3 = UIState.getSelect3LengthShipButton();
    let length4 = UIState.getSelect4LengthShipButton();
    let length5 = UIState.getSelect5LengthShipButton();

    length2.addEventListener("click", selectXLengthShipButtonHandler);
    length3.addEventListener("click", selectXLengthShipButtonHandler);
    length4.addEventListener("click", selectXLengthShipButtonHandler);
    length5.addEventListener("click", selectXLengthShipButtonHandler);
}

/**
 * Disables event listeners for the buttons used to select ship lengths when players are placing ships
 */
function disableSelectShipLengthButtonHandlers() {
    let length2 = UIState.getSelect2LengthShipButton();
    let length3 = UIState.getSelect3LengthShipButton();
    let length4 = UIState.getSelect4LengthShipButton();
    let length5 = UIState.getSelect5LengthShipButton();

    length2.removeEventListener("click", selectXLengthShipButtonHandler);
    length3.removeEventListener("click", selectXLengthShipButtonHandler);
    length4.removeEventListener("click", selectXLengthShipButtonHandler);
    length5.removeEventListener("click", selectXLengthShipButtonHandler);
}

/**
 * Updates Tools' workingShipLength variable to the value of the clicked button and updates button background colors
 * @param {MouseEvent} event A click event on one of the 'selectXLengthShip' buttons 
 */
function selectXLengthShipButtonHandler(event) {
    let btnID = event.target.id;
    let lengthValue = btnID[6]; // These buttons have ids with the format 'selectXLengthShipButton'

    let oldButtonID = UIState.getCurrentlySelectedXLengthShipButtonID();
    DOMManipulation.removeSelectedClassFromButton(oldButtonID);

    Tools.setWorkingShipLength(Number(lengthValue));
    
    UIState.setCurrentlySelectedXLengthShipButton(lengthValue);
    let currentButtonID = UIState.getCurrentlySelectedXLengthShipButtonID();
    DOMManipulation.addSelectedClassToButton(currentButtonID);
}

function enableShipPlacementHandlers() {
    let board1Element = UIState.getBoard1Element();
    board1Element.addEventListener("click", placeShipClick);
    board1Element.addEventListener("contextmenu", removeShipClick);
}

function disableShipPlacementHandlers() {
    let board1Element = UIState.getBoard1Element();
    board1Element.removeEventListener("click", placeShipClick);
    board1Element.removeEventListener("contextmenu", removeShipClick);
}

/**
 * Attempts to place a ship onto the active player's GameBoard. If placement is valid, the DOM is updated to match.
 * @param {Event} event A click event from the user attempting to place a ship
 */
function placeShipClick(event) {
    // If no ships are left to be placed, just return
    if (self.getNumberOfShipsLeftToPlace() === 0) {
        return;
    }
    
    let cell = event.target;

    // Get the idList for this ship
    let idString = cell.id;
    let idNumber = Tools.getIDNumberFromIDString(idString);
    let idList = Tools.createIDListFromIDNumber(idNumber);

    // Check if the length of idList matches the expected length
    let workingLength = Tools.getWorkingShipLength();

    // If the length was invalid, do nothing
    // This will occur if the user tries to click when part of their ship goes beyond an edge of the board
    if (workingLength != idList.length) {
        return;
    }
    
    // Get the board to place on
    let playerTurn = GameState.getPlayerTurn();
    /**
     * @type {GameBoard}
     */
    let boardToPlaceOn;
    if (playerTurn === 1) {
        boardToPlaceOn = GameState.getPlayer1Board();
    } else {
        boardToPlaceOn = GameState.getPlayer2Board();
    }

    // Get the coordinates to place at
    let start = Tools.createCoordinateFromIDNumber(idList[0]);
    let end = Tools.createCoordinateFromIDNumber(idList.at(-1));

    // Attempt the actual placement
    let couldBePlaced = boardToPlaceOn.placeShip(start, end);

    if (!couldBePlaced) {
        return;
    }

    // Successful placement
    let leftToPlace = self.decrementNumberOfShipsToPlaceOfLength(workingLength);

    // Update the boards visually
    DOMManipulation.removePlaceShipClassHandler(event);
    DOMManipulation.addShipClassToIDList(idList);
    
    // Decrement the span for the button with the currently selected ship length
    DOMManipulation.decrementSelectLengthSpanValue(workingLength);

    // If no more ships of the current length need to be placed, call the process function 
    if (leftToPlace === 0) {
        self.processWhenLastShipOfCurrentLengthPlaced(workingLength);
    }
}

/**
 * Updates the DOM, UIState, GameSetup, and Tools as needed for when the currently selected ship length has no more ships to place
 * @param {Number} workingLength The current length of ship that now has no more ships to place
 */
function processWhenLastShipOfCurrentLengthPlaced(workingLength) {
    // Disable and remove the selected class from the button for the current length
    let buttonID = `select${workingLength}LengthShipButton`;
    DOMManipulation.disableButton(buttonID);
    DOMManipulation.removeSelectedClassFromButton(buttonID);

    // If all ships have been placed, prepare for player swap, otherwise select the next ship length available
    if (self.getNumberOfShipsLeftToPlace() === 0) { // All ships placed
        // Enable the 'hide board' button to start the player swap sequence
        // Disable the placeShip class handlers so the player doesn't think they have another ship to place
        DOMManipulation.enableButton(DOMManipulation.BUTTON_NAMES.HIDE_BOARDS);
        DOMManipulation.disablePlaceShipHandlers();

    } else { // At least one ship of any length still needs to be placed
        // If the current length has more ships to be placed, do nothing
        let numberLeftToPlace = self.getNumberOfShipsToPlaceOfGivenLength(workingLength);
        if (numberLeftToPlace > 0) {
            return;
        }

        // Find the next ship length and set workingShipLength to it
        let searchLength = workingLength;
        let nextLength = 0;
        while(nextLength === 0) {
            searchLength -= 1;
            if (searchLength < 2) {
                searchLength = 5;
            }

            numberLeftToPlace = self.getNumberOfShipsToPlaceOfGivenLength(searchLength);
            if (numberLeftToPlace > 0) {
                nextLength = searchLength;
            }
        }

        Tools.setWorkingShipLength(nextLength);

        // Add the 'selected' class to the button for the next length
        UIState.setCurrentlySelectedXLengthShipButton(nextLength);
        let buttonID = `select${nextLength}LengthShipButton`;
        DOMManipulation.addSelectedClassToButton(buttonID);
    }

}

/**
 * Attempts to remove a ship from the active player's GameBoard. If removal was valid, the DOM is updated to match.
 * @param {Event} event A 'contextmenu' (usually right-click) event from the user attempting to remove a ship
 */
function removeShipClick(event) {
    let cell = event.target;

    // If the right-clicked cell doesn't contain the ship class, don't do anything
    if (!cell.classList.contains("ship")) {
        return;
    }

    // Ship, get the idList for it
    let idString = cell.id;
    let idNumber = Tools.getIDNumberFromIDString(idString);

    // Remove from the GameBoard
    // Get the board to remove from
    let playerTurn = GameState.getPlayerTurn();
    /** @type {GameBoard} */
    let boardToPlaceOn;
    if (playerTurn === 1) {
        boardToPlaceOn = GameState.getPlayer1Board();
    } else {
        boardToPlaceOn = GameState.getPlayer2Board();
    }

    // Remove the ship
    let coord = Tools.createCoordinateFromIDNumber(idNumber);
    let removedCoords = boardToPlaceOn.removeShipByCoordinate(coord);
    
    // Create an idList from the removed coordinates
    let idList = [];
    for (const coord of removedCoords) {
        let id = Tools.createIDNumberFromCoordinate(coord);
        idList.push(id);
    }

    let shipLength = idList.length;

    self.incrementNumberOfShipsToPlaceOfLength(shipLength);
    
    // If the ship went from having no more to place to having one to place, the button for that length needs to be re-enabled
    if (self.getNumberOfShipsToPlaceOfGivenLength(shipLength) === 1) {
        let buttonID = `select${shipLength}LengthShipButton`;
        DOMManipulation.enableButton(buttonID);
    }

    // Always increment the span of the button that matches the ship length which was removed
    DOMManipulation.incrementSelectLengthSpanValue(shipLength);

    // If a player has placed their last ship and then decides to remove a ship, a few things need to update
    if (self.getNumberOfShipsLeftToPlace() === 1) {
        // Placing the last ship disables the 'placeShip' class handlers and enables the 'hide boards' button to start the player swap process
        // Those actions need to be undone
        DOMManipulation.enablePlaceShipHandlers();
        DOMManipulation.disableButton(DOMManipulation.BUTTON_NAMES.HIDE_BOARDS);
        
        // Since the removed ship would be the only ship to place, update workingShipLength to the ship's length
        Tools.setWorkingShipLength(shipLength);

        // Add the 'selected' class to the button matching the ship's length
        UIState.setCurrentlySelectedXLengthShipButton(shipLength);
        let buttonID = UIState.getCurrentlySelectedXLengthShipButtonID();
        DOMManipulation.addSelectedClassToButton(buttonID);
    }

    // Update the boards visually
    DOMManipulation.removeShipClassFromIDList(idList);
    DOMManipulation.addPlaceShipClassHandler(event);
}

export {initializeOrReset, getNumberOfShipsLeftToPlace, getNumberOfShipsToPlaceOfGivenLength, incrementNumberOfShipsToPlaceOfLength, incrementThrow, decrementNumberOfShipsToPlaceOfLength, decrementThrow, enableSelectShipLengthButtonHandlers, disableSelectShipLengthButtonHandlers, enableShipPlacementHandlers, disableShipPlacementHandlers, placeShipClick, removeShipClick, processWhenLastShipOfCurrentLengthPlaced, selectXLengthShipButtonHandler, convertLengthToIndexPosition}