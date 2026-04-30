/**
 * @jest-environment jsdom
 */

import * as index from "./index.js";
import * as Tools from "./Tools.js";
import * as GameState from "./GameState.js";
import * as DOMManipulation from "./DOMManipulation.js";
import * as UIState from "./UIState.js";

jest.mock("./Tools.js");
jest.mock("./GameState.js");
jest.mock("./DOMManipulation.js");
jest.mock("./UIState.js");

// Boards
const board1 = document.createElement("div");
board1.id = "board1";
const board2 = document.createElement("div");
board2.id = "board2";

document.body.appendChild(board1);
document.body.appendChild(board2);

// Update-ship-length buttons for test to use
const select5LengthShipButton = document.createElement("button");
select5LengthShipButton.id = "select5LengthShipButton";
document.body.appendChild(select5LengthShipButton);

const select4LengthShipButton = document.createElement("button");
select4LengthShipButton.id = "select4LengthShipButton";
document.body.appendChild(select4LengthShipButton);

const select3LengthShipButton = document.createElement("button");
select3LengthShipButton.id = "select3LengthShipButton";
document.body.appendChild(select3LengthShipButton);

const select2LengthShipButton = document.createElement("button");
select2LengthShipButton.id = "select2LengthShipButton";
document.body.appendChild(select2LengthShipButton);

// Player-step buttons
const hideButton = document.createElement("button");
hideButton.id = "hideBoardsButton";
const swapButton = document.createElement("button");
swapButton.id = "swapPlayersButton";
const revealButton = document.createElement("button");
revealButton.id = "revealBoardsButton";

document.body.appendChild(hideButton);
document.body.appendChild(swapButton);
document.body.appendChild(revealButton);

// Mocking for UIstate
UIState.getSelect5LengthShipButton.mockReturnValue(select5LengthShipButton);
UIState.getSelect4LengthShipButton.mockReturnValue(select4LengthShipButton);
UIState.getSelect3LengthShipButton.mockReturnValue(select3LengthShipButton);
UIState.getSelect2LengthShipButton.mockReturnValue(select2LengthShipButton);
UIState.getHideBoardsButton.mockReturnValue(hideButton);
UIState.getRevealBoardsButton.mockReturnValue(revealButton);
UIState.getSwapPlayersButton.mockReturnValue(swapButton);

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

    describe("selectXLengthShipButton event listener tests", () => {
        
        beforeAll(() => {
            jest.spyOn(select2LengthShipButton, 'addEventListener');
            jest.spyOn(select3LengthShipButton, 'addEventListener');
            jest.spyOn(select4LengthShipButton, 'addEventListener');
            jest.spyOn(select5LengthShipButton, 'addEventListener');

            jest.spyOn(select2LengthShipButton, 'removeEventListener');
            jest.spyOn(select3LengthShipButton, 'removeEventListener');
            jest.spyOn(select4LengthShipButton, 'removeEventListener');
            jest.spyOn(select5LengthShipButton, 'removeEventListener');
        });

        afterAll(() => {
            jest.clearAllMocks();
        });
        
        test("enableSelectShipLengthButtonHandlers: Pass", () => {
            index.enableSelectShipLengthButtonHandlers();

            expect(select5LengthShipButton.addEventListener.mock.calls[0]).toEqual(["click", index.selectXLengthShipButtonHandler]);
            expect(select4LengthShipButton.addEventListener.mock.calls[0]).toEqual(["click", index.selectXLengthShipButtonHandler]);
            expect(select3LengthShipButton.addEventListener.mock.calls[0]).toEqual(["click", index.selectXLengthShipButtonHandler]);
            expect(select2LengthShipButton.addEventListener.mock.calls[0]).toEqual(["click", index.selectXLengthShipButtonHandler]);
        });

        test("disableSelectShipButtonsHandlers: Pass", () => {
            index.disableSelectShipLengthButtonHandlers();

            expect(select5LengthShipButton.removeEventListener.mock.calls[0]).toEqual(["click", index.selectXLengthShipButtonHandler]);
            expect(select4LengthShipButton.removeEventListener.mock.calls[0]).toEqual(["click", index.selectXLengthShipButtonHandler]);
            expect(select3LengthShipButton.removeEventListener.mock.calls[0]).toEqual(["click", index.selectXLengthShipButtonHandler]);
            expect(select2LengthShipButton.removeEventListener.mock.calls[0]).toEqual(["click", index.selectXLengthShipButtonHandler]);
        });
    });

    describe("selectXLengthShipButtonHandler tests", () => {
    
        let clickedButton = {
            id: 'selectXLengthButton'
        }

        let dummyEvent = {
            target: clickedButton
        }

        beforeAll(() => {
            // A mock is needed just to check the correct value is passed, inner logic isn't needed
            Tools.setWorkingShipLength.mockImplementation(() => {return});
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        describe("Pass tests", () => {
            test("Correct number is parsed from the button's ID", () => {
                clickedButton.id = 'select2LengthButton';
                index.selectXLengthShipButtonHandler(dummyEvent);
                expect(Tools.setWorkingShipLength.mock.calls[0][0]).toBe(2);
            });
        });
    });

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
            Tools.createIDListFromIDNumber.mockReturnValue([24, 25, 26]);
            Tools.getWorkingShipLength.mockReturnValue(3);
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
                expect(Tools.getWorkingShipLength.mock.calls).toHaveLength(1);

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
                Tools.getWorkingShipLength.mockReturnValue(0);

                
                index.placeShipClick(event);

                // Check to see if all functions were called as expected
                expect(Tools.getIDNumberFromIDString.mock.calls).toHaveLength(1);
                expect(Tools.createIDListFromIDNumber.mock.calls).toHaveLength(1);
                expect(Tools.getWorkingShipLength.mock.calls).toHaveLength(1);

                expect(GameState.getPlayerTurn.mock.calls).toHaveLength(0);
                expect(GameState.getPlayer1Board.mock.calls).toHaveLength(0);

                expect(Tools.createCoordinateFromIDNumber.mock.calls).toHaveLength(0);

                expect(Array.prototype.placeShip.mock.calls).toHaveLength(0);

                expect(DOMManipulation.removePlaceShipClassHandler.mock.calls).toHaveLength(0);
                expect(DOMManipulation.addShipClassToIDList.mock.calls).toHaveLength(0);
            });

            test("additionalReach > 0 returns early when idList of incorrect length ", () => {
                // Mock setup
                Tools.getWorkingShipLength.mockReturnValue(2);
                
                
                index.placeShipClick(event);

                // Check to see if all functions were called as expected
                expect(Tools.getIDNumberFromIDString.mock.calls).toHaveLength(1);
                expect(Tools.createIDListFromIDNumber.mock.calls).toHaveLength(1);
                expect(Tools.getWorkingShipLength.mock.calls).toHaveLength(1);

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