import {getShotsAndShipsArrays, initializeGameState, setLastShotValue, getLastShotValue} from "../src/GameState.js"
import GameBoard from "../src/GameBoard.js";
import Ship from "../src/Ship.js";

jest.mock("../src/GameBoard.js");

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

    describe("setLastShotValue tests", () => {
        describe("Pass tests", () => {
            test("Base pass: 1 works", () => {
                setLastShotValue(1);
                expect(getLastShotValue()).toBe(1);
            });

            test("-1 works", () => {
                setLastShotValue(-1);
                expect(getLastShotValue()).toBe(-1);
            });
        });
        
        describe("Fail tests", () => {
            test("Non-number throws", () => {
                let badData = {};
                expect(()=>{setLastShotValue(badData)}).toThrow();
                badData = [];
                expect(()=>{setLastShotValue(badData)}).toThrow();
                badData = "a";
                expect(()=>{setLastShotValue(badData)}).toThrow();
            });

            test("Number other than 1 or -1 throws", () => {
                expect(()=>{setLastShotValue(0)}).toThrow();
                expect(()=>{setLastShotValue(-2)}).toThrow();
                expect(()=>{setLastShotValue(2)}).toThrow();
            });
        });
        
    });
});