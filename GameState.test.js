import {getShotsAndShipsArrays, initializeGameState} from "./GameState.js"
import GameBoard from "./GameBoard.js";
import Ship from "./Ship.js";

jest.mock("./GameBoard.js");

let shipList = [
    [[0, 1], [0, 3]],
    [[2, 4], [5, 4]]
];

let board1 = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, -1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let board2 = [
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

describe("GameState tests", () => {

    jest.spyOn(GameBoard.prototype, "getShipList").mockImplementationOnce(() => {
        let ship1 = new Ship(shipList[0][0], shipList[0][1]);
        let ship2 = new Ship(shipList[1][0], shipList[1][1]);
        return [ship1, ship2];
    });
    jest.spyOn(GameBoard.prototype, "getBoard").mockReturnValueOnce(board1).mockReturnValueOnce(board2);

    describe("getShotsAndShipsArrays tests", () => {
        
        test("Pass test", () => {
            initializeGameState();
        
            expect(getShotsAndShipsArrays()).toEqual(
                {
                    "friendShipsPositionsArray": [[[0, 1], [0, 2], [0, 3]], [[2, 4], [3, 4], [4, 4], [5, 4]]],
                    "friendShotsPositionsArray": [...board1],
                    "foeShotsPositionsArray": [...board2]
                }
            )
        });
        
    }); 
});