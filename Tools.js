/**
 * Holds the values functions expect in horizontalOrVertical arguments
 */
const DIRECTION = {
    VERTICAL: "vertical",
    HORIZONTAL: "horizontal"
}

Object.freeze(DIRECTION);

// These are used when creating ID lists to determine the direction to grab IDs and the number in each direction to grab
let searchDirection = DIRECTION.HORIZONTAL;
let additionalToGetEachDirection = 1; // A value of 0 is a special case to represent a 2-cell ship

/**
 * Sets the placement direction of ships, can only be "horizontal" or "vertical"
 * @param {UIState.DIRECTION} direction The direction to place ships 
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

function getSearchDirection() {
    return searchDirection;
}

/**
 * Sets additionalToGetEachDirection.
 * This variable is used to get IDs in each direction from a given ID, meaning each increase is 2 more IDs.
 * This variable has a special case of 0, in which case 1 additional ID is grabbed, not 0.
 * @param {Number} number The number of cell IDs you wish to get in each direction 
 */
function setAdditionalToGetEachDirection(number) {
    additionalToGetEachDirection = number;
}

function getAdditionalToGetEachDirection() {
    return additionalToGetEachDirection;
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
 * Creates a list of ID numbers starting from the given number and using the class level variables searchDirection and additionalToGetEachDirection.
 * An additionalToGetEachDirection value of 0 is a special case and will return a list of length 2, assuming both are in a valid ID range
 * @param {Number} idNum The ID number to create the ID list from
 * @returns An array of cell ID numbers; if additionalToGetEachDirection != 0, valid lists have an odd length
 */
function createIDListFromIDNumber(idNum) {
    let idList = [];
    
    if (idNum < 0 || idNum > 99) {
        return idList;
    }
    
    idList.push(idNum);

    // Check used when using the horizontal direction; ensures all IDs in the list are in the same 10s range
    let tensCheck = Math.floor(idNum / 10);
    // A vertical check isn't needed because overflowing/underflow-ing values would be outside the range of the board

    // Add more IDs to the idList based on the additional steps specified, only IDs in the valid 0-99 range are added
    /** Note: The order IDs are added to idList is specific
     * The base ID is added first
     * From there, the more ID is added, and then the less ID, assuming both are valid
     * This produces a pattern in idList
     * [B] -> [B, M1, L1] -> [B, M1, L1, M2, L2] -> ...
     * The list will only include IDs in the valid range, so you would receive [B, M1, L1, L2] if the M2 value was out of range
     */
    for (let amount = 1; amount <= additionalToGetEachDirection; amount++) {
        let more;
        let less;

        // more and less are calculated and evaluated differently depending on the given direction
        if (searchDirection === DIRECTION.HORIZONTAL) {
            more = idNum + amount;
            less = idNum - amount;
            
            if (more < 100) {
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
            more = idNum + (amount * 10);
            less = idNum - (amount * 10);

            if (more < 100) {
                idList.push(more);
            }

            if (less > -1) {
                idList.push(less);
            }
        }
    }
    
    // Handle the additionalToGetEachDirection special case of 0 (This is meant to be used with 2-cell sized ships)
    if (additionalToGetEachDirection === 0) {
        let more;

        if (searchDirection === DIRECTION.HORIZONTAL) {
            more = idNum + 1;

            if (more < 100) {
                if (Math.floor(more / 10) === tensCheck) {
                    idList.push(more);
                }
            }

        } else if (searchDirection === DIRECTION.VERTICAL) {
            more = idNum + 10;

            if (more < 100) {
                idList.push(more);
            }
        }
    }

    return idList;
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

export {DIRECTION, setAdditionalToGetEachDirection, setSearchDirection, getAdditionalToGetEachDirection, getSearchDirection, createIDListFromIDNumber, getIDNumberFromIDString, switchSearchDirection, createCoordinateFromIDNumber, createIDNumberFromCoordinate}