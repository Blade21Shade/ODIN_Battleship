export default class Ship {
    #isSunk = false;
    #numberOfHits = 0;
    #length = 0;
    #coordinateList = [];

    /**
     * Creates a ship from the given coordinates - within the coordinates, either the x or y position has to be the same for both of them
     * @param {[number, number]} startCoordinate The coordinate to start building the ship's coordinate list from
     * @param {[number, number]} endCoordinate The coordinate to stop (inclusive) building the ship's coordinate list
     */
    constructor(startCoordinate, endCoordinate) {
        if (startCoordinate[0] !== endCoordinate[0] && startCoordinate[1] !== endCoordinate[1]) {
            throw new Error("Ships must be aligned vertically or horizontally: invalid coordinates given to constructor")
        }
        
        this.#coordinateList.push(startCoordinate);
        this.#length++;

        // Fill coordinate list after figuring out which direction to go to get from startCoordinate to endCoordinate
        if (startCoordinate[0] === endCoordinate[0]) { // Horizontally laid
            let x = startCoordinate[0];
            if (startCoordinate[1] > endCoordinate[1]) {
                for (let i = startCoordinate[1] - 1; i >= endCoordinate[1]; i--) {
                    this.#coordinateList.push([x,i]);
                    this.#length++;
                }
            } else {
                for (let i = startCoordinate[1] + 1; i <= endCoordinate[1]; i++) {
                    this.#coordinateList.push([x,i]);
                    this.#length++;
                }
            }
        } else { // Vertically laid
            let y = startCoordinate[1];
            if (startCoordinate[0] > endCoordinate[0]) {
                for (let i = startCoordinate[0] - 1; i >= endCoordinate[0]; i--) {
                    this.#coordinateList.push([i,y]);
                    this.#length++;
                }
            } else {
                for (let i = startCoordinate[0] + 1; i <= endCoordinate[0]; i++) {
                    this.#coordinateList.push([i,y]);
                    this.#length++;
                }
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