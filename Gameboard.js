import Ship from "./Ship.js"

export default class Gameboard {
    // Becomes a 2D array in the constructor
    // 0s haven't been fired at, -1 is miss, 1 is hit
    #board = [];
    
    #maxPosition = 0;
    #ships = [];

    constructor(size) {
        this.#maxPosition = size;
        // Rows
        for (let i = 0; i < size; i++) {
            this.#board.push([]);
            
            // Columns
            let lastArray = this.#board.at(-1);
            for (let j = 0; j < size; j++) {
                lastArray.push(0);
            }
        }
    }

    placeShip(startPos, endPos) {
        // Check if either position is outside the board's size
        if (startPos[0] < 0 || startPos[0] > this.#maxPosition ||
            startPos[1] < 0 || startPos[1] > this.#maxPosition || 
            endPos[0] < 0 || endPos[0] > this.#maxPosition ||
            endPos[1] < 0 || endPos[1] > this.#maxPosition
        ) {
            throw new Error("Ships must be placed within the board's boundaries: received out of bounds position");
        }

        let ship = new Ship(startPos, endPos);

        // See if this ship overlaps with any other ships already placed
        let overlap = false;
        let shipCoords = ship.getCoordinateList();
        overlapLoop: for (let i = 0; i < this.#ships.length; i++) {
            let storedShipCoords = this.#ships[i].getCoordinateList();

            for (let j = 0; j < shipCoords.length; j++) {
                let shipCoord = shipCoords[j];

                for (let k = 0; k < storedShipCoords.length; k++) {
                    let storedCoord = storedShipCoords[k];

                    if (shipCoord[0] === storedCoord[0] && shipCoord[1] === storedCoord[1]) {
                        overlap = true;
                        break overlapLoop;
                    }
                }
            }
        }

        if (overlap) {
            throw new Error("Ships cannot overlap: received ship coords that overlap with another ship")
        }

        // Within bounds and not overlapping any other ships: valid placement
        this.#ships.push(ship);
    }

    getShipList() {
        return this.#ships;
    }

    clearShipList() {
        this.#ships.length = 0;
    }
}