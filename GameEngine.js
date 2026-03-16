import * as GameState from "./GameState.js"

/**
 * Shoot at the given coordinate on the opposing player's board
 * @param {[number, number]} coord The coordinate to shoot at
 * @returns {boolean} true if the shot was valid (hit or miss), or false if it was invalid
 */
function shootAtCoordinate(coord) {
    // If the player has already taken a shot this turn, ignore the shot
    if (GameState.getShotTakenThisTurn()) {
        return;
    }

    // Process the shot
    let isValidShot = true;
    let board = GameState.getBoardToShootAt();

    let hitVal = board.fireAtBoard(coord);
    if (hitVal !== 0) { // Valid shot (1 for hit or -1 for miss)
        GameState.setShotTakenThisTurn(true); // Prevent player from shooting again this turn
    } else { // Invalid shot (this will occur if a player clicks a cell that they've already shot at)
        isValidShot = false;
    }

    return isValidShot;
}

/**
 * Checks if the game should end based on the current state of the game
 * @returns true if the game should end, or false if it should continue
 */
function endGameCheck() {
    let endGame = false;

    let board = GameState.getBoardToShootAt();
    let allShipsSunk = board.getAllShipsSunk();
    
    if (allShipsSunk) {
        endGame = true;
    }

    return endGame;
}

export {shootAtCoordinate, endGameCheck}