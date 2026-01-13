export default class Ship {
    #isSunk = false;
    #numberOfHits = 0;
    #length = 0;
    #coordinateList = [];

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