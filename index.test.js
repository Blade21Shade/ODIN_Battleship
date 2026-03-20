/**
 * @jest-environment jsdom
 */

import * as index from "./index.js";
import * as Tools from "./Tools.js";
import * as GameState from "./GameState.js";
import * as DOMManipulation from "./DOMManipulation.js";

jest.mock("./Tools.js");
jest.mock("./GameState.js");
jest.mock("./DOMManipulation.js");

// DOM
const board1 = document.createElement("div");
board1.id = "board1";
const board2 = document.createElement("div");
board2.id = "board2";

document.body.appendChild(board1);
document.body.appendChild(board2);

const hideButton = document.createElement("button");
hideButton.id = "hideBoardsButton";
const swapButton = document.createElement("button");
swapButton.id = "swapPlayersButton";
const revealButton = document.createElement("button");
revealButton.id = "revealBoardsButton";

document.body.appendChild(hideButton);
document.body.appendChild(swapButton);
document.body.appendChild(revealButton);

// GameBoard
let gameBoard1 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

describe("index tests", () => {

    describe("placeShipClick tests", () => {
        // Event for function
        let cell = {
            id: "board1-cell25"
        };
        
        let event = {
            target: cell
        }

        // Add a placeShip function to Array so gameBoard1 can be used as an Array rather than an actual GameBoard object
        beforeAll(()=> {
            Object.defineProperty(Array.prototype, 'placeShip', {value: function(start, end) {
                return true;
            },
            writable: true,
            configurable: true});

            // Use a spyOn so tests can use the .mock property
            jest.spyOn(Array.prototype, 'placeShip').mockImplementation((start, end)=> {
                gameBoard1[2][4] = 1;
                gameBoard1[2][5] = 1;
                gameBoard1[2][6] = 1;

                return true;
            });
        });

        // Get rid of the placeShip function so Array.prototype is clean between describe blocks and test files
        afterAll(()=>{
            delete Array.prototype.placeShip;
        });
        
        // Reset mocks and variables to a specific state before each test
        // The Base Pass test uses these values, other tests will alter then as necessary
        beforeEach(() => {
            // Mock stuff
            jest.clearAllMocks();
            
            Tools.getIDNumberFromIDString.mockReturnValue(25);
            Tools.createIDListFromIDNumber.mockReturnValue([25, 26, 24]); // IDLists are created in this format
            Tools.getAdditionalToGetEachDirection.mockReturnValue(1);
            Tools.createCoordinateFromIDNumber.mockReturnValueOnce([4, 2]).mockReturnValueOnce([6, 2]);

            GameState.getPlayerTurn.mockReturnValue(1); // Functionality is identical between players besides the board being affected, so only one board needs to be tested
            GameState.getPlayer1Board.mockReturnValue(gameBoard1);

            // These don't need any logic mocked since they are the very last calls of the function
            DOMManipulation.removePlaceShipClassHandler.mockImplementation(()=>{return});
            DOMManipulation.addShipClassToIDList.mockImplementation(()=>{return});


            // Non-mock stuff

            // Clear the gameBoard
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    gameBoard1[i][j] = 0;
                }
            }
        });

        describe("Pass tests", () => {
            test("Base pass", () => {
                index.placeShipClick(event);

                // Check to see if all functions were called as expected
                expect(Tools.getIDNumberFromIDString.mock.calls).toHaveLength(1);
                expect(Tools.createIDListFromIDNumber.mock.calls).toHaveLength(1);
                expect(Tools.getAdditionalToGetEachDirection.mock.calls).toHaveLength(1);

                expect(GameState.getPlayerTurn.mock.calls).toHaveLength(1);
                expect(GameState.getPlayer1Board.mock.calls).toHaveLength(1);

                expect(Tools.createCoordinateFromIDNumber.mock.calls).toHaveLength(2);

                expect(Array.prototype.placeShip.mock.calls).toHaveLength(1);

                expect(DOMManipulation.removePlaceShipClassHandler.mock.calls).toHaveLength(1);
                expect(DOMManipulation.addShipClassToIDList.mock.calls).toHaveLength(1);
                
            });

            test("additionalReach of 0 expects idList of length 2", () => {
                // Mock setup
                Tools.getAdditionalToGetEachDirection.mockReturnValue(0);
                Tools.createIDListFromIDNumber.mockReturnValue([25, 26]);
                
                
                index.placeShipClick(event);

                // Check to see if all functions were called as expected
                expect(Tools.getIDNumberFromIDString.mock.calls).toHaveLength(1);
                expect(Tools.createIDListFromIDNumber.mock.calls).toHaveLength(1);
                expect(Tools.getAdditionalToGetEachDirection.mock.calls).toHaveLength(1);

                expect(GameState.getPlayerTurn.mock.calls).toHaveLength(1);
                expect(GameState.getPlayer1Board.mock.calls).toHaveLength(1);

                expect(Tools.createCoordinateFromIDNumber.mock.calls).toHaveLength(2);

                expect(Array.prototype.placeShip.mock.calls).toHaveLength(1);

                expect(DOMManipulation.removePlaceShipClassHandler.mock.calls).toHaveLength(1);
                expect(DOMManipulation.addShipClassToIDList.mock.calls).toHaveLength(1);
            });
        });

        describe("Fail (early return) tests", () => {
            test("additionalReach of 0 returns early when idList not of length 2", () => {
                // Mock setup
                Tools.getAdditionalToGetEachDirection.mockReturnValue(0);

                
                index.placeShipClick(event);

                // Check to see if all functions were called as expected
                expect(Tools.getIDNumberFromIDString.mock.calls).toHaveLength(1);
                expect(Tools.createIDListFromIDNumber.mock.calls).toHaveLength(1);
                expect(Tools.getAdditionalToGetEachDirection.mock.calls).toHaveLength(1);

                expect(GameState.getPlayerTurn.mock.calls).toHaveLength(0);
                expect(GameState.getPlayer1Board.mock.calls).toHaveLength(0);

                expect(Tools.createCoordinateFromIDNumber.mock.calls).toHaveLength(0);

                expect(Array.prototype.placeShip.mock.calls).toHaveLength(0);

                expect(DOMManipulation.removePlaceShipClassHandler.mock.calls).toHaveLength(0);
                expect(DOMManipulation.addShipClassToIDList.mock.calls).toHaveLength(0);
            });

            test("additionalReach > 0 returns early when idList of incorrect length ", () => {
                // Mock setup
                Tools.getAdditionalToGetEachDirection.mockReturnValue(2);
                
                
                index.placeShipClick(event);

                // Check to see if all functions were called as expected
                expect(Tools.getIDNumberFromIDString.mock.calls).toHaveLength(1);
                expect(Tools.createIDListFromIDNumber.mock.calls).toHaveLength(1);
                expect(Tools.getAdditionalToGetEachDirection.mock.calls).toHaveLength(1);

                expect(GameState.getPlayerTurn.mock.calls).toHaveLength(0);
                expect(GameState.getPlayer1Board.mock.calls).toHaveLength(0);

                expect(Tools.createCoordinateFromIDNumber.mock.calls).toHaveLength(0);

                expect(Array.prototype.placeShip.mock.calls).toHaveLength(0);

                expect(DOMManipulation.removePlaceShipClassHandler.mock.calls).toHaveLength(0);
                expect(DOMManipulation.addShipClassToIDList.mock.calls).toHaveLength(0);
            });

            test("Early return when a ship cannot be placed", () => {
                // Make the placement invalid
                jest.spyOn(Array.prototype, 'placeShip').mockImplementation((start, end)=> {return false;});

                index.placeShipClick(event);

                // Check to see if all functions were called as expected
                // Other functions must have been called correctly to get to this point, no need to check them
                expect(Array.prototype.placeShip.mock.calls).toHaveLength(1);

                expect(DOMManipulation.removePlaceShipClassHandler.mock.calls).toHaveLength(0);
                expect(DOMManipulation.addShipClassToIDList.mock.calls).toHaveLength(0);


                // Re-enable the spyOn logic for other tests
                jest.spyOn(Array.prototype, 'placeShip').mockImplementation((start, end)=> {
                    gameBoard1[2][4] = 1;
                    gameBoard1[2][5] = 1;
                    gameBoard1[2][6] = 1;

                    return true;
                });
            });
        });
    });


    describe("removeShipClick tests", () => {
        // Event for function
        let cell = {
            id: "board1-cell25",
            doesContain: true, // Replace with false for fail test
            classList: {
                contains: function(search) {
                    return cell.doesContain;
                }
            }
        };
        
        let event = {
            target: cell
        }

        // Add a removeShipByCoordinate function to Array so gameBoard1 can be used as an Array rather than an actual GameBoard object
        beforeAll(()=> {
            Object.defineProperty(Array.prototype, 'removeShipByCoordinate', {value: function(coord) {
                return true;
            },
            writable: true,
            configurable: true});

            // Use a spyOn so tests can use the .mock property
            jest.spyOn(Array.prototype, 'removeShipByCoordinate').mockImplementation((coord)=> {
                gameBoard1[2][4] = 0;
                gameBoard1[2][5] = 0;
                gameBoard1[2][6] = 0;

                return [[4,2], [5,2], [6,2]];
            });
        });

        // Get rid of the placeShip function so Array.prototype is clean between describe blocks and test files
        afterAll(()=>{
            delete Array.prototype.removeShipByCoordinate;
        });

        // Reset mocks and variables to a specific state before each test
        // The Base Pass test uses these values, other tests will alter then as necessary
        beforeEach(() => {
            // Mock stuff
            jest.clearAllMocks();
            
            Tools.getIDNumberFromIDString.mockReturnValue(25);
            
            GameState.getPlayerTurn.mockReturnValue(1); // Functionality is identical between players besides the board being affected, so only one board needs to be tested
            GameState.getPlayer1Board.mockReturnValue(gameBoard1);

            Tools.createCoordinateFromIDNumber.mockReturnValueOnce([5, 2]);

            Tools.createIDNumberFromCoordinate.mockReturnValueOnce(24).mockReturnValueOnce(25).mockReturnValueOnce(26);

            // These don't need any logic mocked since they are the very last calls of the function
            DOMManipulation.removeShipClassFromIDList.mockImplementation(()=>{return});
            DOMManipulation.addPlaceShipClassHandler.mockImplementation(()=>{return});


            // Non-mock stuff

            // Reset the gameBoard
            gameBoard1[2][4] = 1;
            gameBoard1[2][5] = 1;
            gameBoard1[2][6] = 1;

            // Reset cell
            cell.doesContain = true;
        });

        test("Pass test", () => {
            index.removeShipClick(event);

            // All these calls are expected when a ship is removed successfully
            expect(Tools.getIDNumberFromIDString.mock.calls).toHaveLength(1);
            
            expect(GameState.getPlayerTurn.mock.calls).toHaveLength(1);
            expect(GameState.getPlayer1Board.mock.calls).toHaveLength(1);

            expect(Tools.createCoordinateFromIDNumber.mock.calls).toHaveLength(1);
            expect(Array.prototype.removeShipByCoordinate.mock.calls).toHaveLength(1);

            expect(Tools.createIDNumberFromCoordinate.mock.calls).toHaveLength(3);

            expect(DOMManipulation.removeShipClassFromIDList.mock.calls).toHaveLength(1);
            expect(DOMManipulation.addPlaceShipClassHandler.mock.calls).toHaveLength(1);
        });

        test("Invalid cell click test", () => {
            // Simulate an invalid click
            cell.doesContain = false;
            
            index.removeShipClick(event);

            // This is the first call after the if that should return
            // If it doesn't have a call, then none of the other functions will
            expect(Tools.getIDNumberFromIDString.mock.calls).toHaveLength(0);
        });

    });
});