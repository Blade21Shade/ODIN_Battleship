import Ship from "./Ship.js"

export default class GameBoard {
    // Becomes a 2D array in the constructor
    // 0s haven't been fired at, -1 is miss, 1 is hit
    /** @type {Number[][]} */
    #board = [];

    #maxPosition = 0;
    /** @type {Ship[]} */
    #ships = [];
    #allShipsSunk = false;

    /**
     * Creates a board size #x# where # is the size variable - all positions start as 0 for "not shot at"
     * @param {number} size The dimension for the game board, creates a square
     */
    constructor(size) {
        this.#maxPosition = size;

        // Rows
        for (let i = 0; i < size; i++) {
            let row = [];
            // Fill row with column entries
            for (let j = 0; j < size; j++) {
                row.push(0);
            }
            
            this.#board.push(row);
        }
    }

    /**
     * Puts a ship in the ships container if both positions are within the bounds of the board and the ship doesn't overlap with coordinates of other ships 
     * @param {[number, number]} firstEndCoordinate The first end coordinate of the ship
     * @param {[number, number]} secondEndCoordinate The second end coordinate of the ship
     * @returns true if the ship could be placed, false if it couldn't (overlapping another ship or out of bounds)
     */
    placeShip(firstEndCoordinate, secondEndCoordinate) {
        let couldBePlaced = false;
        
        // Check if either position is outside the board's size
        if (firstEndCoordinate[0] < 0 || firstEndCoordinate[0] > this.#maxPosition ||
            firstEndCoordinate[1] < 0 || firstEndCoordinate[1] > this.#maxPosition || 
            secondEndCoordinate[0] < 0 || secondEndCoordinate[0] > this.#maxPosition ||
            secondEndCoordinate[1] < 0 || secondEndCoordinate[1] > this.#maxPosition
        ) {
            return couldBePlaced;
        }

        let newShip = new Ship(firstEndCoordinate, secondEndCoordinate);

        // See if the new ship overlaps with any already placed ships
        let overlap = false;
        let newShipCoords = newShip.getCoordinateList();
        overlapLoop: for (let i = 0; i < this.#ships.length; i++) {
            let placedShipCoords = this.#ships[i].getCoordinateList();

            for (let j = 0; j < newShipCoords.length; j++) {
                let newCoord = newShipCoords[j];

                for (let k = 0; k < placedShipCoords.length; k++) {
                    let placedCoord = placedShipCoords[k];

                    if (newCoord[0] === placedCoord[0] && newCoord[1] === placedCoord[1]) {
                        overlap = true;
                        break overlapLoop;
                    }
                }
            }
        }

        if (overlap) {
            return couldBePlaced;
        }

        // Within bounds and not overlapping any other ships: valid placement
        this.#ships.push(newShip);
        couldBePlaced = true;
        return couldBePlaced;
    }

    /**
     * Removes a ship containing the given coord from the board 
     * @param {[number, number]} coord An [x,y] position of the ship which needs to be removed 
     * @returns The coordinate list of the ship that was removed, or an empty array if the coordinate wasn't in any ship on the board
     */
    removeShipByCoordinate(coord) {
        /** @type {Number[][]} */
        let coordsOfRemovedShip = [];

        // Search for the ship which contains the given coordinate
        let length = this.#ships.length;
        shipLoop: for (let i = 0; i < length; i++) {
            let ship = this.#ships[i];
            let shipCoords = ship.getCoordinateList();
            for (let j = 0; j < shipCoords.length; j++) {
                let shipCoord = shipCoords[j];
                if (coord[0] === shipCoord[0] && coord[1] === shipCoord[1]) {
                    coordsOfRemovedShip = shipCoords;

                    // Remove this ship from the board
                    this.#ships.splice(i, 1);
                    break shipLoop;
                }
            }
        }

        return coordsOfRemovedShip;
    }

    /**
     * Fires a shot at the board if the position is within the bounds of the board and that position hasn't already been shot at; sets that board position to 1 if hit, or -1 if miss
     * @param {[number, number]} position The position to fire at on this board
     * @returns A value based on hit status of the shot: 1 for hit, -1 for miss, 0 for invalid shot
     */
    fireAtBoard(position) {
        // Used to indicate if the shot was a hit, miss, or invalid
        let hitVal = 0;
        
        // Out of bounds check
        let x = position[0];
        let y = position[1];
        if (x < 0 || x > this.#maxPosition ||
            y < 0 || y > this.#maxPosition
        ) {
            return hitVal;
        }

        // Check if this position has already been fired at
        let boardHitVal = this.#board[y][x];
        if (boardHitVal !== 0) {
            return hitVal;
        }

        hitVal = -1; // Miss value
        for (let i = 0; i < this.#ships.length; i++) {
            let ship = this.#ships[i];
            let hit = ship.hitCheck([x,y]);
            if (hit) {
                hitVal = 1; // Hit value
                break;
            }
        }

        this.#board[y][x] = hitVal;
        this.checkIfAllShipsSunk();

        return hitVal;
    }

    /**
     * Checks whether all ships on the board are sunk; if so sets allShipsSunk and returns true, if not returns false
     * @returns True if all ships have been sunk, or false if not
     */
    checkIfAllShipsSunk() {
        let allSunk = true;
        for (const ship of this.#ships) {
            if (ship.getIsSunk() === false) {
                allSunk = false;
                break;
            }
        }

        if (allSunk) {
            this.#allShipsSunk = true;
        }

        return this.#allShipsSunk;
    }

    getBoard() {
        return this.#board;
    }

    getShipList() {
        return this.#ships;
    }

    getAllShipsSunk() {
        return this.#allShipsSunk;
    }

    clearShipList() {
        this.#ships.length = 0;
    }

    /**
     * Resets the board so each entry is 0, the "not shot at" status
     */
    resetBoardHits() {
        for (let i = 0; i < this.#board.length; i++) {
            let row = this.#board[i];
            for (let j = 0; j < this.#board.length; j++) {
                row[j] = 0;
            }
        }
    }

    /**
     * Resets a board to it's state when created by the constructor
     */
    resetBoard() {
        this.clearShipList();
        this.resetBoardHits();
        this.#allShipsSunk = false;
    }
}