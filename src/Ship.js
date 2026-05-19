export default class Ship {
    #isSunk = false;
    #numberOfHits = 0;
    #length = 0;
    /** @type {Number[][]} */
    #coordinateList = [];

    /**
     * Creates a ship from the given coordinates
     * - The coordinates must have the same X or Y coordinate as Ships must lay vertically or horizontally
     * - Ex: [2, A], [2, C] for a horizontally laid ship with X = 2
     * - Ships are always created from the lower of the two coordinates to the higher, order doesn't matter
     * - EX: Ships created with [2, A], [2, C] OR [2, C], [2, A] will both have the following coordinate list: [[2, A], [2, B], [2, C]]
     * @param {[number, number]} firstEndCoordinate The coordinate of one end of the ship
     * @param {[number, number]} secondEndCoordinate The coordinate of the other end of the ship
     */
    constructor(firstEndCoordinate, secondEndCoordinate) {
        if (firstEndCoordinate[0] !== secondEndCoordinate[0] && firstEndCoordinate[1] !== secondEndCoordinate[1]) {
            throw new Error("Ships must be aligned vertically or horizontally: invalid coordinates given to constructor")
        }

        // Fill coordinate list after figuring out which direction to go
        // This will always created ships from the "lower" value to the "higher" value, not necessarily the firstEnd to secondEnd
        let lower;
        let higher;
        if (firstEndCoordinate[0] === secondEndCoordinate[0]) { // Horizontally laid
            if (firstEndCoordinate[1] < secondEndCoordinate[1]) {
                lower = firstEndCoordinate[1];
                higher = secondEndCoordinate[1];
            } else {
                lower = secondEndCoordinate[1];
                higher = firstEndCoordinate[1];
            }

            let x = firstEndCoordinate[0];

            for (let i = lower; i <= higher; i++) {
                this.#coordinateList.push([x,i]);
                this.#length++;
            }
        } else { // Vertically laid
            if (firstEndCoordinate[0] < secondEndCoordinate[0]) {
                lower = firstEndCoordinate[0];
                higher = secondEndCoordinate[0];
            } else {
                lower = secondEndCoordinate[0];
                higher = firstEndCoordinate[0];
            }

            let y = firstEndCoordinate[1];

            for (let i = lower; i <= higher; i++) {
                this.#coordinateList.push([i,y]);
                this.#length++;
            }
        }
    }

    /**
     * Checks whether the given position will hit the ship -  if so, increments the private variable for tracking hits
     * @param {[number, number]} position The position to check if it is in the ship's coordinate list
     * @returns True if the hit was successful, or false if not
     */
    hitCheck(position) {
        let hit = false;
        for (let i = 0; i < this.#coordinateList.length; i++) {
            let thisPos = this.#coordinateList[i];

            if (position[0] === thisPos[0] && position[1] === thisPos[1]) {
                hit = true;
                break;
            }
        }

        // If hit, update number of hits and check if this is sunk
        if (hit) {
            this.#numberOfHits++;
            this.#sinkCheck();
        }
        
        return hit;
    }

    #sinkCheck() {
        if (this.#numberOfHits === this.#length) {
            this.#isSunk = true;
        }
    }

    getNumberOfHits() {
        return this.#numberOfHits;
    }

    getIsSunk() {
        return this.#isSunk;
    }

    getCoordinateList() {
        return this.#coordinateList;
    }

    getLength() {
        return this.#length;
    }
}