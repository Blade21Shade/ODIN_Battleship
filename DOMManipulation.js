const FRIEND_OR_FOE = {
    FRIEND: "friend",
    FOE: "foe"
}

const BOARD_NUMBER = {
    ONE: 1,
    TWO: 2
}

Object.freeze(FRIEND_OR_FOE);
Object.freeze(BOARD_NUMBER);

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

function resetBoardElementsCells() {
    let board1 = grabBoardElement(BOARD_NUMBER.ONE);
    let board2 = grabBoardElement(BOARD_NUMBER.TWO);

    for (let i = 0; i < 100; i++) {
        resetCellClassList(board1.children[i], FRIEND_OR_FOE.FRIEND);
        resetCellClassList(board2.children[i], FRIEND_OR_FOE.FOE);
    }
}

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

function clearCellClassList(cell) {
    cell.classList.remove("miss", "hit", "friend", "foe", "ship");
}

function resetCellClassList(cell, friendOrFoe) {
    cell.classList.remove("miss", "hit", "friend", "foe", "ship");
    if (friendOrFoe === FRIEND_OR_FOE.FRIEND) {
        cell.classList.add("friend");
    } else {
        cell.classList.add("foe");
    }
}

function friendOrFoeValidityCheck(friendOrFoe) {
    if (friendOrFoe !== FRIEND_OR_FOE.FRIEND && friendOrFoe !== FRIEND_OR_FOE.FOE) {
        throw new Error("Invalid friend or foe option given")
    }
}

export {FRIEND_OR_FOE, BOARD_NUMBER, initializeBoardElements, resetBoardElementsCells, fillBoardElementShots, fillBoardElementShips, grabBoardElement}