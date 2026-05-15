/**
 * @jest-environment jsdom
 */

import * as GameSetup from "./GameSetup.js";
import * as GameState from "./GameState.js";
import * as UIState from "./UIState.js";
import * as Tools from "./Tools.js";
import * as DOMManipulation from "./DOMManipulation.js";

jest.mock("./UIState.js");
jest.mock("./Tools.js");
jest.mock("./DOMManipulation.js");
jest.mock("./GameState");

// Boards
const board1 = document.createElement("div");
board1.id = "board1";
document.body.appendChild(board1);

// Update-ship-length buttons
const select5LengthShipButton = document.createElement("button");
select5LengthShipButton.id = "select5LengthShipButton";
select5LengthShipButton.className = "";
document.body.appendChild(select5LengthShipButton);

const select4LengthShipButton = document.createElement("button");
select4LengthShipButton.id = "select4LengthShipButton";
select4LengthShipButton.className = "";
document.body.appendChild(select4LengthShipButton);

const select3LengthShipButton = document.createElement("button");
select3LengthShipButton.id = "select3LengthShipButton";
select3LengthShipButton.className = "";
document.body.appendChild(select3LengthShipButton);

const select2LengthShipButton = document.createElement("button");
select2LengthShipButton.id = "select2LengthShipButton";
select2LengthShipButton.className = "";
document.body.appendChild(select2LengthShipButton);

// Player-step buttons
const hideButton = document.createElement("button");
hideButton.id = "hideBoardsButton";
document.body.appendChild(hideButton);

// GameBoard
let gameBoard1 = {
    board: [
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
    ],
    numberOfCalls: 0,
    placeShip: function(start, end) {
        this.board[2][4] = 1;
        this.board[2][5] = 1;
        this.board[2][6] = 1;
        gameBoard1.numberOfCalls++;
        return true;
    },
    removeShipByCoordinate: function(coord) {
        gameBoard1.numberOfCalls++;
        return [24, 25, 26];
    },
    resetBoardAndCalls: function() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                this.board[i][j] = 0;
            }
        }
        gameBoard1.numberOfCalls = 0;
    }
};

// Mocking for UIstate
UIState.getSelect5LengthShipButton.mockReturnValue(select5LengthShipButton);
UIState.getSelect4LengthShipButton.mockReturnValue(select4LengthShipButton);
UIState.getSelect3LengthShipButton.mockReturnValue(select3LengthShipButton);
UIState.getSelect2LengthShipButton.mockReturnValue(select2LengthShipButton);
UIState.getHideBoardsButton.mockReturnValue(hideButton);

// Mocking for GameState
// Since board 1 and board 2 act the exact same only one board is needed for tests
GameState.getPlayerTurn.mockReturnValue(1);
GameState.getPlayer1Board.mockReturnValue(gameBoard1);

// The mocking below assumes the 3 button will always be the result of this call, so a real implementation isn't needed 
UIState.setCurrentlySelectedXLengthShipButton.mockImplementation(()=>{return});

// Mocking for DOMManipulation
DOMManipulation.removeSelectedClassFromButton.mockImplementation((ID)=> {
    if (ID === "select2LengthShipButton") { // Only the 2 button will be removed from
        select2LengthShipButton.className = "";
    } else {
        throw new Error("test error");
    }
});

DOMManipulation.addSelectedClassToButton.mockImplementation((ID)=> {
    if (ID === "select3LengthShipButton" || ID === "select5LengthShipButton") { // The 3 length button is added to during tests, 5 during setup in between tests
        select3LengthShipButton.className = "selected";
    } else {
        throw new Error("test error");
    }
});

// Mocks for functions from GameSetup
// These will have spyOn statements assigned to them as needed, which can be released once the mock is no longer needed
let processMock;
let getNumberOfShipsLeftToPlaceMock;
let decrementMock;
let incrementMock;

describe("GameSetup tests", () => {
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
            GameSetup.enableSelectShipLengthButtonHandlers();

            expect(select5LengthShipButton.addEventListener.mock.calls[0]).toEqual(["click", GameSetup.selectXLengthShipButtonHandler]);
            expect(select4LengthShipButton.addEventListener.mock.calls[0]).toEqual(["click", GameSetup.selectXLengthShipButtonHandler]);
            expect(select3LengthShipButton.addEventListener.mock.calls[0]).toEqual(["click", GameSetup.selectXLengthShipButtonHandler]);
            expect(select2LengthShipButton.addEventListener.mock.calls[0]).toEqual(["click", GameSetup.selectXLengthShipButtonHandler]);
        });

        test("disableSelectShipButtonsHandlers: Pass", () => {
            GameSetup.disableSelectShipLengthButtonHandlers();

            expect(select5LengthShipButton.removeEventListener.mock.calls[0]).toEqual(["click", GameSetup.selectXLengthShipButtonHandler]);
            expect(select4LengthShipButton.removeEventListener.mock.calls[0]).toEqual(["click", GameSetup.selectXLengthShipButtonHandler]);
            expect(select3LengthShipButton.removeEventListener.mock.calls[0]).toEqual(["click", GameSetup.selectXLengthShipButtonHandler]);
            expect(select2LengthShipButton.removeEventListener.mock.calls[0]).toEqual(["click", GameSetup.selectXLengthShipButtonHandler]);
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

        beforeEach(()=>{
            UIState.getCurrentlySelectedXLengthShipButtonID.mockReturnValueOnce(select2LengthShipButton.id).mockReturnValueOnce(select3LengthShipButton.id);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        describe("Pass tests", () => {
            test("Correct number is parsed from the button's ID", () => {
                clickedButton.id = 'select3LengthButton';
                GameSetup.selectXLengthShipButtonHandler(dummyEvent);

                expect(Tools.setWorkingShipLength.mock.calls[0][0]).toBe(3);
                expect(select2LengthShipButton.className).toBe("");
                expect(select3LengthShipButton.className).toBe("selected");
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

        beforeAll(()=> {
            // These functions are tested elsewhere so have them hard return or do nothing
            processMock = jest.spyOn(GameSetup, "processWhenLastShipOfCurrentLengthPlaced").mockImplementation((argument)=>{return});
            getNumberOfShipsLeftToPlaceMock = jest.spyOn(GameSetup, "getNumberOfShipsLeftToPlace").mockReturnValue(1);
            decrementMock = jest.spyOn(GameSetup, "decrementNumberOfShipsToPlaceOfLength").mockReturnValue(0);

            // Mocks
            Tools.getIDNumberFromIDString.mockReturnValue(25);
            Tools.createIDListFromIDNumber.mockReturnValue([24, 25, 26]);
            Tools.getWorkingShipLength.mockReturnValue(3);
            Tools.createCoordinateFromIDNumber.mockReturnValueOnce([4, 2]).mockReturnValueOnce([6, 2]);

            // These don't need any logic mocked since they are the very last calls of the function
            DOMManipulation.removePlaceShipClassHandler.mockImplementation(()=>{return});
            DOMManipulation.addShipClassToIDList.mockImplementation(()=>{return});

            // Doesn't need tested here
            DOMManipulation.decrementSelectLengthSpanValue.mockReturnValue(0);
        });

        afterAll(()=>{
            processMock.mockRestore();
            getNumberOfShipsLeftToPlaceMock.mockRestore();
            decrementMock.mockRestore();

            jest.clearAllMocks();
        });
        
        // Reset mocks and variables to a specific state before each test
        // The Base Pass test uses these values, other tests will alter then as necessary
        beforeEach(() => {
            // Mock stuff
            jest.clearAllMocks();

            // Clear the gameBoard
            gameBoard1.resetBoardAndCalls();
        });

        describe("Pass tests", () => {
            test("Base pass", () => {
                GameSetup.placeShipClick(event);

                // Check to see if all functions were called as expected
                expect(Tools.getIDNumberFromIDString.mock.calls).toHaveLength(1);
                expect(Tools.createIDListFromIDNumber.mock.calls).toHaveLength(1);
                expect(Tools.getWorkingShipLength.mock.calls).toHaveLength(1);

                expect(GameState.getPlayerTurn.mock.calls).toHaveLength(1);
                expect(GameState.getPlayer1Board.mock.calls).toHaveLength(1);

                expect(Tools.createCoordinateFromIDNumber.mock.calls).toHaveLength(2);

                expect(gameBoard1.numberOfCalls).toBe(1);

                expect(DOMManipulation.removePlaceShipClassHandler.mock.calls).toHaveLength(1);
                expect(DOMManipulation.addShipClassToIDList.mock.calls).toHaveLength(1);

                expect(GameSetup.processWhenLastShipOfCurrentLengthPlaced.mock.calls).toHaveLength(1);
                
            });

            test("More ships of the current length need placed; process function shouldn't be called", () => {
                GameSetup.decrementNumberOfShipsToPlaceOfLength.mockReturnValueOnce(1); // After the once occurs, the original return value is used
                GameSetup.placeShipClick(event);

                // Check to see if all functions were called as expected
                expect(Tools.getIDNumberFromIDString.mock.calls).toHaveLength(1);
                expect(Tools.createIDListFromIDNumber.mock.calls).toHaveLength(1);
                expect(Tools.getWorkingShipLength.mock.calls).toHaveLength(1);

                expect(GameState.getPlayerTurn.mock.calls).toHaveLength(1);
                expect(GameState.getPlayer1Board.mock.calls).toHaveLength(1);

                expect(Tools.createCoordinateFromIDNumber.mock.calls).toHaveLength(2);

                expect(gameBoard1.numberOfCalls).toBe(1);

                expect(DOMManipulation.removePlaceShipClassHandler.mock.calls).toHaveLength(1);
                expect(DOMManipulation.addShipClassToIDList.mock.calls).toHaveLength(1);

                // Difference from Base pass
                expect(GameSetup.processWhenLastShipOfCurrentLengthPlaced.mock.calls).toHaveLength(0);
            });
        });

        describe("Fail (early return) tests", () => {
            test("Returns early when no more ships need to be placed", () => {
                GameSetup.getNumberOfShipsLeftToPlace.mockReturnValueOnce(0);
                
                GameSetup.placeShipClick(event);

                // First function which would be called if a return didn't happen; if it isn't called, none after are
                expect(Tools.getIDNumberFromIDString.mock.calls).toHaveLength(0);
            });
            
            test("Early return when idList.length doesn't match the current ship length: Out of board bounds", () => {
                // Mock setup
                Tools.getWorkingShipLength.mockReturnValueOnce(2);
                
                GameSetup.placeShipClick(event);

                // Check to see if all functions were called as expected
                expect(Tools.getIDNumberFromIDString.mock.calls).toHaveLength(1);
                expect(Tools.createIDListFromIDNumber.mock.calls).toHaveLength(1);
                expect(Tools.getWorkingShipLength.mock.calls).toHaveLength(1);

                // First function which would be called if a return didn't happen; if it isn't called, none after are
                expect(GameState.getPlayerTurn.mock.calls).toHaveLength(0);
            });

            test("Early return when idList.length matches the current ship length but the ship still cannot be placed: Would overlap with a ship", () => {
                // Make the placement invalid
                gameBoard1.placeShip = function(start, end) {
                    gameBoard1.numberOfCalls++;
                    return false;
                };

                GameSetup.placeShipClick(event);

                // Check to see if all functions were called as expected
                // Other functions must have been called correctly to get to this point, no need to check them
                expect(gameBoard1.numberOfCalls).toBe(1);

                // These would not have been called if the failure to place occurs
                expect(DOMManipulation.removePlaceShipClassHandler.mock.calls).toHaveLength(0);
                expect(DOMManipulation.addShipClassToIDList.mock.calls).toHaveLength(0);

                // Restore the placement function
                gameBoard1.placeShip = function(start, end) {
                    this.board[2][4] = 1;
                    this.board[2][5] = 1;
                    this.board[2][6] = 1;
                    gameBoard1.numberOfCalls++;
                    return true;
                };
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

            // These don't need any logic mocked since they are the very last calls of the function
            DOMManipulation.removeShipClassFromIDList.mockImplementation(()=>{return});
            DOMManipulation.addPlaceShipClassHandler.mockImplementation(()=>{return});

            UIState.getCurrentlySelectedXLengthShipButtonID.mockReturnValue(select3LengthShipButton.id);

            Tools.getIDNumberFromIDString.mockReturnValue(25);
            
            GameState.getPlayerTurn.mockReturnValue(1); // Functionality is identical between players besides the board being affected, so only one board needs to be tested
            GameState.getPlayer1Board.mockReturnValue(gameBoard1);
            
            incrementMock = jest.spyOn(GameSetup, "incrementNumberOfShipsToPlaceOfLength").mockReturnValue(2);
        });

        afterAll(()=>{
            incrementMock.mockRestore();
        });

        // Reset mocks and variables to a specific state before each test
        // The Base Pass test uses these values, other tests will alter then as necessary
        beforeEach(() => {
            // Mock stuff
            jest.clearAllMocks();

            Tools.createCoordinateFromIDNumber.mockReturnValueOnce([5, 2]);

            Tools.createIDNumberFromCoordinate.mockReturnValueOnce(24).mockReturnValueOnce(25).mockReturnValueOnce(26);

            // Non-mock stuff

            // Reset the gameBoard
            gameBoard1.resetBoardAndCalls();

            // Reset cell
            cell.doesContain = true;
        });

        test("Pass test", () => {
            GameSetup.removeShipClick(event);

            // All these calls are expected when a ship is removed successfully
            expect(Tools.getIDNumberFromIDString.mock.calls).toHaveLength(1);
            
            expect(GameState.getPlayerTurn.mock.calls).toHaveLength(1);
            expect(GameState.getPlayer1Board.mock.calls).toHaveLength(1);

            expect(Tools.createCoordinateFromIDNumber.mock.calls).toHaveLength(1);
            expect(gameBoard1.numberOfCalls).toBe(1);

            expect(Tools.createIDNumberFromCoordinate.mock.calls).toHaveLength(3);

            expect(DOMManipulation.removeShipClassFromIDList.mock.calls).toHaveLength(1);
            expect(DOMManipulation.addPlaceShipClassHandler.mock.calls).toHaveLength(1);
        });

        test("Invalid cell click test", () => {
            // Simulate an invalid click
            cell.doesContain = false;
            
            GameSetup.removeShipClick(event);

            // This is the first call after the if that should return
            // If it doesn't have a call, then none of the other functions will
            expect(Tools.getIDNumberFromIDString.mock.calls).toHaveLength(0);
        });

    });

    describe("initializeOrReset", () => {
        
        afterAll(()=>{
            jest.clearAllMocks();
        });

        test("Base Pass", () => {
            GameSetup.initializeOrReset();
            
            // Check the correct number of ships we're given
            expect(GameSetup.getNumberOfShipsLeftToPlace()).toEqual(5);

            // Check that function call to other files was done correctly
            expect(DOMManipulation.addSelectedClassToButton.mock.calls[0][0]).toEqual(DOMManipulation.BUTTON_NAMES.SELECT5);
            expect(UIState.setCurrentlySelectedXLengthShipButton.mock.calls[0][0]).toBe(5);
            expect(Tools.setWorkingShipLength.mock.calls[0][0]).toBe(5);
        });
    });

    describe("getNumberOfShipsLeftToPlace", () => {
        beforeEach(()=>{
            GameSetup.initializeOrReset();
        });

        test("Base Pass", () => {
            expect(GameSetup.getNumberOfShipsLeftToPlace()).toBe(5);
        });
    });

    describe("getNumberLeftToPlaceOfGivenLength", () => {
        beforeEach(()=>{
            GameSetup.initializeOrReset();
        });

        test("Base Pass", () => {
            expect(GameSetup.getNumberOfShipsToPlaceOfGivenLength(2)).toBe(1);
            expect(GameSetup.getNumberOfShipsToPlaceOfGivenLength(3)).toBe(2);
            expect(GameSetup.getNumberOfShipsToPlaceOfGivenLength(4)).toBe(1);
            expect(GameSetup.getNumberOfShipsToPlaceOfGivenLength(5)).toBe(1);
        });
    });

    describe("convertLengthToIndexPosition", () => {
        test("Base Pass", () => {
            expect(GameSetup.convertLengthToIndexPosition(2)).toBe(0);
        });

        test("Fail: length converts to index position out of valid range", () => {
            // One below valid range
            expect(()=>{GameSetup.convertLengthToIndexPosition(1)}).toThrow();

            // One above valid range
            expect(()=>{GameSetup.convertLengthToIndexPosition(6)}).toThrow();
        });
    });

    describe("increment/decrementNumberOfShipsToPlaceOfLength", () => {
        beforeEach(() => {
            GameSetup.initializeOrReset();
        });

        describe("decrement", () => {
            test("Base Pass", () => {
                expect(GameSetup.decrementNumberOfShipsToPlaceOfLength(2)).toBe(0);
            });

            test("Fail: Decrementing would go below 0 ships left to place for a given length", () => {
                GameSetup.decrementNumberOfShipsToPlaceOfLength(2); // Make 0 left
                expect(()=>{GameSetup.decrementNumberOfShipsToPlaceOfLength(2)}).toThrow();
            });
        });

        describe("increment", () => {
            test("Base Pass", () => {
                // Make the number left to place a value that won't go beyond the max number when added to
                GameSetup.decrementNumberOfShipsToPlaceOfLength(2);

                expect(GameSetup.incrementNumberOfShipsToPlaceOfLength(2)).toBe(1);
            });

            test("Fail: Number left to place would go beyond max number", () => {
                expect(()=>{GameSetup.incrementNumberOfShipsToPlaceOfLength(2)}).toThrow();
            })
        });
    });
});