import Ship from "./Ship.js"

export default class GameBoard {
    // Becomes a 2D array in the constructor
    // 0s haven't been fired at, -1 is miss, 1 is hit
    #board = [];

    #maxPosition = 0;
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
     * @param {[number, number]} startPos The starting position (coordinate) of the ship 
     * @param {[number, number]} endPos The end position (coordinate) of the ship
     */
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

    /**
     * Removes a ship containing the given coord from the board 
     * @param {[number, number]} coord An [x,y] position of the ship which needs to be removed 
     * @returns The coordinate list of the ship that was removed, or an empty array if the coordinate wasn't in any ship on the board
     */
    removeShipByCoordinate(coord) {
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
     * @returns A value based on hit status of the shot: 1 for hit, -1 for miss
     */
    fireAtBoard(position) {
        let x = position[0];
        let y = position[1];
        if (x < 0 || x > this.#maxPosition ||
            y < 0 || y > this.#maxPosition
        ) {
            throw new Error("Given position isn't inside the board's bounds");
        }

        let boardHitVal = this.#board[y][x];

        if (boardHitVal !== 0) {
            throw new Error("Given position has already been fired at");
        }

        let hitVal = -1; // Miss value
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