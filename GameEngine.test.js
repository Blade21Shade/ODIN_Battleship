import { shootAtCoordinate, endGameCheck} from "./GameEngine.js";

import GameBoard from "./GameBoard.js";

import * as GameState from "./GameState.js"

// Board to use during tests
let board1 = new GameBoard(10);

board1.placeShip([1,0], [2,0]);
board1.placeShip([7,0], [7,1]);
board1.placeShip([8,0], [8,1]);

describe("GameEngine tests", () => {

    // Using the local variable for fine control in tests
    beforeAll(() => {
        jest.spyOn(GameState, "getBoardToShootAt").mockReturnValue(board1);
    });

    beforeEach(() => {
        board1.resetBoardHits();
    });

    describe("shootAtCoordinate tests", () => {

        beforeEach(()=> {
            jest.spyOn(GameState, "getShotTakenThisTurn").mockReturnValueOnce(false); // If false at start, the function doesn't work
        });
        

        test("Hit", () => {
            expect(shootAtCoordinate([1,0])).toBe(true);
            expect(board1.getBoard()[0][1]).toBe(1); // Hit value
            expect(GameState.getShotTakenThisTurn()).toBe(true);
        });

        test("Miss", () => {
            expect(shootAtCoordinate([0,0])).toBe(true);
            expect(board1.getBoard()[0][0]).toBe(-1); // Miss value
            expect(GameState.getShotTakenThisTurn()).toBe(true);
        });

        test("Already shot at", () => {
            // Simulate a previous shot by the player
            shootAtCoordinate([1, 0]);
            GameState.setShotTakenThisTurn(false); // This is usually handled elsewhere (index.js as of writing), so it needs to be manually set for this test

            expect(shootAtCoordinate([1,0])).toBe(false); // Invalid shots return false
            expect(board1.getBoard()[0][1]).toBe(1); // The position should still register as being shot at originally
            
            expect(GameState.getShotTakenThisTurn()).toBe(false); // Invalid shots shouldn't update shotTakenThisTurn
        });

    });

    // These tests are basically fake since I'm setting the final evaluation's value, but I'm writing them for completeness sake
    describe("endGameCheckTests", () => {
        
        test("True return", () => {
            jest.spyOn(GameBoard.prototype, "getAllShipsSunk").mockReturnValueOnce(true);
            expect(endGameCheck()).toBe(true);
        });

        test("False return", () => {
            jest.spyOn(GameBoard.prototype, "getAllShipsSunk").mockReturnValueOnce(false);
            expect(endGameCheck()).toBe(false);
        });


    });

});