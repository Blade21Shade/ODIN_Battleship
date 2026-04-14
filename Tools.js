/**
 * Holds the values functions expect in horizontalOrVertical arguments
 */
const DIRECTION = Object.freeze({
    VERTICAL: "vertical",
    HORIZONTAL: "horizontal"
});

// These are used when creating ID lists to determine the direction to grab IDs and the number in each direction to grab
let searchDirection = DIRECTION.HORIZONTAL;
let workingShipLength = 4;

/**
 * Sets the placement direction of ships, can only be "horizontal" or "vertical"
 * @param {DIRECTION} direction The direction to place ships 
 */
function setSearchDirection(direction) {
    if (direction === DIRECTION.VERTICAL || direction === DIRECTION.HORIZONTAL) {
        searchDirection = direction;
    }
}

/**
 * Switches searchDirection to horizontal if it is currently vertical, or vertical if it is currently horizontal 
 */
function switchSearchDirection() {
    if (searchDirection === DIRECTION.VERTICAL) {
        searchDirection = DIRECTION.HORIZONTAL;
    } else {
        searchDirection = DIRECTION.VERTICAL
    }
}

/**
 * @returns {DIRECTION}
 */
function getSearchDirection() {
    return searchDirection;
}

function setWorkingShipLength(length) {
    if (length < 2 || length > 5) {
        throw new Error("Working ship length must be inclusively between 2 and 5, a number outside that range was given");
    }
    workingShipLength = length;
}

function getWorkingShipLength() {
    return workingShipLength;
}

/**
 * Gets the ID number from an idString
 * @param {String} idString The idString to get the ID number from - idStrings are formatted as 'boardX-cellYZ', if YZ would be less than 10 it is just cellZ
 * @returns The ID number for that idString, or -1 on failure
 */
function getIDNumberFromIDString(idString) {
    let idNum = -1;
    
    // idStrings are in the form 'boardX-cellYZ'; YZ can be < 10, in which case it only has one character for the number
    if (isNaN(idString.at(-2))) { // If the second to last character isn't a number only grab the last character
        idNum = Number(idString.at(-1));
    } else {
        idNum = Number(idString.at(-2) + idString.at(-1));
    }
    
    // If an invalid string was given then idNum becomes NaN; change this to the general "fail" value
    if (isNaN(idNum)) {
        idNum = -1;
    }

    return idNum;
}

/**
 * Creates a list of ID numbers starting from the given ID number
 * - This uses the variables searchDirection and workingShipLength of this file to create the IDList
 * @param {Number} idNum The ID number to create the ID list from
 * @returns An array of cell ID numbers
 * - If an ID would be out of range of overflow, the array length will be different than workingShipLength
 */
function createIDListFromIDNumber(idNum) {
    let idList = [];
    
    if (idNum < 0 || idNum > 99) {
        return idList;
    }

    // Create the idList
    idList.push(idNum);
    addIDsToEachSideOfIDList(idNum, idList);

    // The IDs will be in a weird order at this point due to how the loop for adding IDs works, sort them for simplicity
    return idList.sort((a, b)=> {
        let toReturn;
        if (a < b) {
            toReturn = -1;
        } else if (a === b) { // Should never happen
            toReturn = 0;
        } else {
            toReturn = 1;
        }

        return toReturn;
    });
}

function addIDsToEachSideOfIDList(baseID, idList) {
    // Ships being placed horizontally all need to be in the same row
    // So this value is checked against to ensure IDs added to idList are in the same row as baseID
    let tensCheck = Math.floor(baseID / 10);
    // Ships being placed vertically can only have invalid values if those values would be outside the bounds of the board
    // That's already checked normally, so no special check is needed
    
    // Determine the number of IDs that need to be added to each side of the base ID
    let numberToAddToEachSide;
    if (workingShipLength % 2 === 0) {
        // This results in the ship having a length 1 less than needed, which is corrected at the end of the process
        numberToAddToEachSide = (workingShipLength - 2) / 2; // -2 accounts for the 2-cell sized ship which needs 0 on each side
    } else {
        numberToAddToEachSide = (workingShipLength - 1) / 2; // -1 makes this an even number, which / 2 then turns into a valid int
    }
    
    // Add more IDs to the idList, only IDs in the valid 0-99 range are added
    /**
     * This adds IDs to the list in a sort of weird order because the for loop does more and less at the same time
     * Assuming all valid IDs, they are added as [baseID, more1, less1, more2, less2] etc.
     */
    let more = baseID;
    let less = baseID;
    for (let i = 1; i <= numberToAddToEachSide; i++) {
        // more and less are calculated and evaluated differently depending on the given direction
        if (searchDirection === DIRECTION.HORIZONTAL) {
            more += 1;
            less -= 1;
            
            if (more < 100) {
                // This tens check ensures that IDs are in the same 10s range, which prevents wrapping
                if (Math.floor(more / 10) === tensCheck) {
                    idList.push(more);
                }
            }

            if (less > -1) {
                if (Math.floor(less / 10) === tensCheck) {
                    idList.push(less);
                }
            }
        } else if (searchDirection === DIRECTION.VERTICAL) {
            more += 10;
            less -= 10;

            if (more < 100) {
                idList.push(more);
            }

            if (less > -1) {
                idList.push(less);
            }
        }
    }

    // Ships with an even length need an additional ID added to their list
    if (workingShipLength % 2 === 0) {
        if (searchDirection === DIRECTION.HORIZONTAL) {
            more += 1;

            if (more < 100) {
                if (Math.floor(more / 10) === tensCheck) {
                    idList.push(more);
                }
            }

        } else if (searchDirection === DIRECTION.VERTICAL) {
            more += 10;

            if (more < 100) {
                idList.push(more);
            }
        }
    }
}

/**
 * Creates a coordinate for a GameBoard that correlates to an idNumber of a DOM cell.
 * Note that coordinate [0,0] is in the top left of the grid and increasing y values go down the grid, not up it.
 * This means larger idNumbers are further down the grid.
 * @param {number} idNum The idNum of the DOM cell
 * @returns The coordinate corresponding to idNum
 */
function createCoordinateFromIDNumber(idNum) {
    // The 'one's' value of the idNum because x, the 'ten's' value becomes y
    let x = idNum % 10;
    let y = Math.floor(idNum/10);
    
    let coord = [x,y];
    return coord;
}

/**
 * Creates an idNumber for a DOM cell that correlates to a GameBoard coordinate.
 * Note that coordinate [0,0] is in the top left of the grid and increasing y values go down the grid, not up it.
 * This means larger idNumbers are further down the grid.
 * @param {[number, number]} coord The coordinate of a GameBoard 
 * @returns The idNum corresponding to the coordinate
 */
function createIDNumberFromCoordinate(coord) {
    let ones = coord[0];
    let tens = coord[1];

    let idNum = tens * 10 + ones;
    return idNum;
}

export {DIRECTION, setWorkingShipLength, setSearchDirection, getWorkingShipLength, getSearchDirection, createIDListFromIDNumber, addIDsToEachSideOfIDList, getIDNumberFromIDString, switchSearchDirection, createCoordinateFromIDNumber, createIDNumberFromCoordinate}