import {getShotsAndShipsArrays, initializeGameState, setLastShotValue, getLastShotValue, switchCurrentPlayerState} from "../src/GameState.js"
import GameBoard from "../src/GameBoard.js";
import Ship from "../src/Ship.js";

jest.mock("../src/GameBoard.js");

let shipList = [
    [[0, 1], [0, 3]],
    [[2, 4], [5, 4]]
];

let ship1 = new Ship(shipList[0][0], shipList[0][1]);
let ship2 = new Ship(shipList[1][0], shipList[1][1]);

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

    jest.spyOn(GameBoard.prototype, "getShipList").mockImplementation(() => {
        return [ship1, ship2];
    });
    let getBoardSpy = jest.spyOn(GameBoard.prototype, "getBoard");

    beforeAll(()=>{
        initializeGameState();
    });

    afterAll(() => {
        getBoardSpy.mockRestore();
    });

    describe("getShotsAndShipsArrays tests", () => {
        describe("Pass tests", () => {
            test("Base pass: no parameter given gets current player", () => {
                // Player 1
                getBoardSpy.mockReturnValueOnce(board1).mockReturnValueOnce(board2);
                expect(getShotsAndShipsArrays()).toEqual(
                    {
                        "friendShipsPositionsArray": [[[0, 1], [0, 2], [0, 3]], [[2, 4], [3, 4], [4, 4], [5, 4]]],
                        "friendShotsPositionsArray": [...board1],
                        "foeShotsPositionsArray": [...board2]
                    }
                );

                // Player 2
                switchCurrentPlayerState();

                getBoardSpy.mockReturnValueOnce(board2).mockReturnValueOnce(board1);
                expect(getShotsAndShipsArrays(2)).toEqual(
                    {
                        "friendShipsPositionsArray": [[[0, 1], [0, 2], [0, 3]], [[2, 4], [3, 4], [4, 4], [5, 4]]],
                        "friendShotsPositionsArray": [...board2],
                        "foeShotsPositionsArray": [...board1]
                    }
                );

            });

            test("1 gets player 1 arrays", () => {
                getBoardSpy.mockReturnValueOnce(board1).mockReturnValueOnce(board2);
                expect(getShotsAndShipsArrays(1)).toEqual(
                    {
                        "friendShipsPositionsArray": [[[0, 1], [0, 2], [0, 3]], [[2, 4], [3, 4], [4, 4], [5, 4]]],
                        "friendShotsPositionsArray": [...board1],
                        "foeShotsPositionsArray": [...board2]
                    }
                );
            });

            test("2 gets player 2 arrays", () => {
                getBoardSpy.mockReturnValueOnce(board2).mockReturnValueOnce(board1);
                expect(getShotsAndShipsArrays(2)).toEqual(
                    {
                        "friendShipsPositionsArray": [[[0, 1], [0, 2], [0, 3]], [[2, 4], [3, 4], [4, 4], [5, 4]]],
                        "friendShotsPositionsArray": [...board2],
                        "foeShotsPositionsArray": [...board1]
                    }
                );
            });
        });

        describe("Fail tests", () => {
            test("Number other than 0, 1, or 2 throws an error", () => {
                expect(()=>{getShotsAndShipsArrays(-1)}).toThrow();
                expect(()=>{getShotsAndShipsArrays(3)}).toThrow();
            });
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