/**
 * @jest-environment jsdom
 */

import { fillBoardElementShots, fillBoardElementShips, fillBoardElementsAll, FRIEND_OR_FOE, BOARD_NUMBER, BUTTON_NAMES, addPlaceShipClassHandler, removePlaceShipClassHandler, addShipClassToIDList, removeShipClassFromIDList, grabBoardElement, grabButtonElement, initializeBoardElements, resetBoardElements, initializePlayerButtons, enablePlaceShipHandlers, disablePlaceShipHandlers, wheelEventHandler, resetCellClassList, friendOrFoeValidityCheck} from "./DOMManipulation";
import DOMManipulation from "./DOMManipulation.js"; // This is so I can use spyOn() for testing fillBoardElementsAll
import * as Tools from "./Tools.js";
import * as UIState from "./UIState.js";
jest.mock("./UIState.js");

// Mocking Tools
// Below is what would be needed to mock some functions, but not all of them
// This would be useful if the functions would need to be mocked many times in different tests
// This wouldn't be as useful if you just need to mock each once (like my case), in which case jest.spyOn() can be more useful and require less writing

// jest.mock("./Tools.js", () => {
//     // Needed for functions not labeled in the returned object to function normally
//     const originalModule = jest.requireActual("./Tools.js");

//     // Mocking
//     return {
//         __esModule: true,
//         ...originalModule,
//         Tools.getIDNumberFromIDString: jest.fn(),
//         Tools.createIDListFromIDNumber: jest.fn() 
//     }
// });

// Inside tests, you would write the following
// Tools.getIDNumberFromIDString.mockReturnValue(); 
// Tools.createIDListFromIDNumber.mockReturnValue([14, 15, 16]); 

// Boards for the tests to use
const board1 = document.createElement("div");
board1.id = "board1";
document.body.appendChild(board1);

const board2 = document.createElement("div");
board2.id = "board2";
document.body.appendChild(board2);

// Buttons for tests to use
const hideBoardsButton = document.createElement("div");
hideBoardsButton.id = "hideBoardsButton";
document.body.appendChild(hideBoardsButton);

const swapPlayersButton = document.createElement("div");
swapPlayersButton.id = "swapPlayersButton";
document.body.appendChild(swapPlayersButton);

const revealBoardsButton = document.createElement("div");
revealBoardsButton.id = "revealBoardsButton";
document.body.appendChild(revealBoardsButton);

// Setup the boards for use
const cell = document.createElement("div");
cell.classList.add("cell");
fillBoardsTestUtility();

function fillBoardsTestUtility() {
    for (let i = 0; i < 100; i++) {
        let clone = cell.cloneNode();
        clone.classList.toggle("friend");
        clone.id = `board1-cell${i}`;
        board1.appendChild(clone);

        clone = cell.cloneNode();
        clone.classList.toggle("foe");
        clone.id = `board2-cell${i}`;
        board2.appendChild(clone);
    }
}

// Mocking for UIstate
UIState.getBoard1Element.mockReturnValue(board1);
UIState.getBoard2Element.mockReturnValue(board2);
UIState.getHideBoardsButton.mockReturnValue(hideBoardsButton);
UIState.getRevealBoardsButton.mockReturnValue(revealBoardsButton);
UIState.getSwapPlayersButton.mockReturnValue(swapPlayersButton);

function setupFriendFoeCellsTestUtility() {
    for (let i = 0; i < 100; i++) {
        board1.children[i].classList.remove("miss", "hit", "ship", "placeShip");
        board2.children[i].classList.remove("miss", "hit");

        board1.children[i].classList.add("friend");
        board2.children[i].classList.add("foe");
    }
}

// Variables the tests can use 
const board1Array = [
    [1,0,0,0,0,0,0,1,0,-1],
    [0,1,0,0,0,0,0,1,0,-1],
    [0,0,0,0,0,0,0,0,0,0], // This row and below are unused, they are present so fillBoardElement() still works
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];

const shipCoordinates1 = [
    [[1,0], [2,0]],
    [[7,0], [7,1]],
    [[8,0], [8,1]]
];

// Reset the board cell's to a clean classList for the next test
afterEach(() => {
    setupFriendFoeCellsTestUtility();
});

describe("DOMManipulation tests", () => {
    describe("Board tests", () => {
        describe("initializeBoardElements tests", () => {
            beforeEach(()=>{
                // Clear the DOM elements to ensure this function does all setup
                board1.replaceChildren();
                board2.replaceChildren();
            });
            
            afterAll(() => {
                // Replace board1/2 contents with testUtility functions for consistency 
                board1.replaceChildren();
                board2.replaceChildren();

                fillBoardsTestUtility();
                setupFriendFoeCellsTestUtility();
            });

            test("Pass test", () => {
                initializeBoardElements();

                // Make sure boards are proper size
                expect(board1.childElementCount).toBe(100);
                expect(board2.childElementCount).toBe(100);

                // Inspect a few cells to make sure they are marked properly
                expect(board1.children[0].id).toBe("board1-cell0"); // First child
                expect(board1.children[0].className).toBe("cell friend");
                expect(board1.children[99].id).toBe("board1-cell99"); // Last child
                expect(board1.children[99].className).toBe("cell friend");
                expect(board1.children[37].id).toBe("board1-cell37"); // Random child
                expect(board1.children[37].className).toBe("cell friend");

                expect(board2.children[0].id).toBe("board2-cell0"); // First child
                expect(board2.children[0].className).toBe("cell foe");
                expect(board2.children[99].id).toBe("board2-cell99"); // Last child
                expect(board2.children[99].className).toBe("cell foe");
                expect(board2.children[37].id).toBe("board2-cell37"); // Random child
                expect(board2.children[37].className).toBe("cell foe");
            });

            test("Fail: throws if function has been called previously", () => {
                initializeBoardElements();
                expect(()=>{initializeBoardElements()}).toThrow();
            });
        });

        describe("resetBoardElements tests", () => {
            afterEach(() => {
                // Clear boards
                board1.replaceChildren();
                board2.replaceChildren();
                
                // Re-fill boards
                fillBoardsTestUtility();
                setupFriendFoeCellsTestUtility();
            });

            test("Pass test", () => {
                // Give the boards some dummy data that should be cleared
                board1.children[0].classList.toggle("dummy");
                board1.children[99].classList.toggle("dummy");
                board1.children[37].classList.toggle("dummy");
                
                board2.children[0].classList.toggle("dummy");
                board2.children[99].classList.toggle("dummy");
                board2.children[37].classList.toggle("dummy");

                resetBoardElements();

                // Inspect a few cells to make sure they are marked properly
                expect(board1.children[0].className).toBe("cell friend"); // First child
                expect(board1.children[99].className).toBe("cell friend"); // Last child
                expect(board1.children[37].className).toBe("cell friend"); // Random child

                expect(board2.children[0].className).toBe("cell foe"); // First child
                expect(board2.children[99].className).toBe("cell foe"); // Last child
                expect(board2.children[37].className).toBe("cell foe"); // Random child
            });

            test("Fail: throws if the boards haven't been initialized beforehand", () => {
                // Clear boards
                board1.replaceChildren();
                board2.replaceChildren();

                expect(() => {resetBoardElements()}).toThrow();
            });
        });

        describe("Fill board-element tests", () => {
            describe("Pass tests", () => {
                describe("Friend board tests", () => {
                    test("Just Shots", () => {
                        fillBoardElementShots(board1Array, FRIEND_OR_FOE.FRIEND, BOARD_NUMBER.ONE);

                        // Left values in board1Array
                        expect(board1.children[0].className).toBe("cell hit");
                        expect(board1.children[11].className).toBe("cell hit");

                        // Right not-edge
                        expect(board1.children[7].className).toBe("cell hit");
                        expect(board1.children[17].className).toBe("cell hit");

                        // Right edge
                        expect(board1.children[9].className).toBe("cell miss");
                        expect(board1.children[19].className).toBe("cell miss");
                    });

                    test("Just Ships", () => {
                        fillBoardElementShips(shipCoordinates1, FRIEND_OR_FOE.FRIEND, BOARD_NUMBER.ONE);

                        // Ships
                        expect(board1.children[1].className).toBe("cell ship");
                        expect(board1.children[2].className).toBe("cell ship");

                        expect(board1.children[8].className).toBe("cell ship");
                        expect(board1.children[18].className).toBe("cell ship");

                        expect(board1.children[7].className).toBe("cell ship");
                        expect(board1.children[17].className).toBe("cell ship");
                    });

                    test("Shots then Ships", () => {
                        fillBoardElementShots(board1Array, FRIEND_OR_FOE.FRIEND, BOARD_NUMBER.ONE);
                        fillBoardElementShips(shipCoordinates1, FRIEND_OR_FOE.FRIEND, BOARD_NUMBER.ONE);

                        // Ships
                        expect(board1.children[1].className).toBe("cell ship");
                        expect(board1.children[2].className).toBe("cell ship");

                        expect(board1.children[8].className).toBe("cell ship");
                        expect(board1.children[18].className).toBe("cell ship");

                        // Shot-ship; these two should be marked hit when there is a conflict between hit and ship spaces
                        expect(board1.children[7].className).toBe("cell hit");
                        expect(board1.children[17].className).toBe("cell hit");
                    });

                    test("Ships then Shots", () => {
                        fillBoardElementShots(board1Array, FRIEND_OR_FOE.FRIEND, BOARD_NUMBER.ONE);
                        fillBoardElementShips(shipCoordinates1, FRIEND_OR_FOE.FRIEND, BOARD_NUMBER.ONE);

                        // Ships
                        expect(board1.children[1].className).toBe("cell ship");
                        expect(board1.children[2].className).toBe("cell ship");

                        expect(board1.children[8].className).toBe("cell ship");
                        expect(board1.children[18].className).toBe("cell ship");

                        // Shot-ship; these two should be marked hit when there is a conflict between hit and ship spaces
                        expect(board1.children[7].className).toBe("cell hit");
                        expect(board1.children[17].className).toBe("cell hit");
                    });
                });

                describe("Foe board tests", () => {
                    test("Just Shots", () => {
                        fillBoardElementShots(board1Array, FRIEND_OR_FOE.FOE, BOARD_NUMBER.TWO);

                        // Left values in board1Array
                        expect(board2.children[0].className).toBe("cell hit");
                        expect(board2.children[11].className).toBe("cell hit");

                        // Right not-edge
                        expect(board2.children[7].className).toBe("cell hit");
                        expect(board2.children[17].className).toBe("cell hit");

                        // Right edge
                        expect(board2.children[9].className).toBe("cell miss");
                        expect(board2.children[19].className).toBe("cell miss");
                    });

                    test("Just Ships - don't show ships", () => {
                        fillBoardElementShips(shipCoordinates1, FRIEND_OR_FOE.FOE, BOARD_NUMBER.TWO);

                        // Ships - shouldn't show
                        expect(board2.children[1].className).toBe("cell foe");
                        expect(board2.children[2].className).toBe("cell foe");

                        expect(board2.children[8].className).toBe("cell foe");
                        expect(board2.children[18].className).toBe("cell foe");

                        expect(board2.children[7].className).toBe("cell foe");
                        expect(board2.children[17].className).toBe("cell foe");
                    });

                    test("Shots then Ships - don't show ships", () => {
                        fillBoardElementShots(board1Array, FRIEND_OR_FOE.FOE, BOARD_NUMBER.TWO);
                        fillBoardElementShips(shipCoordinates1, FRIEND_OR_FOE.FOE, BOARD_NUMBER.TWO);

                        // Ships - since this is at the foe board, these shouldn't be marked with ship
                        expect(board2.children[1].className).toBe("cell foe");
                        expect(board2.children[2].className).toBe("cell foe");

                        expect(board2.children[8].className).toBe("cell foe");
                        expect(board2.children[18].className).toBe("cell foe");

                        // Shot-ship; these two should be marked hit when there is a conflict between hit and ship spaces
                        expect(board2.children[7].className).toBe("cell hit");
                        expect(board2.children[17].className).toBe("cell hit");
                    });

                    test("Ships then Shots - don't show ships", () => {
                        fillBoardElementShots(board1Array, FRIEND_OR_FOE.FOE, BOARD_NUMBER.TWO);
                        fillBoardElementShips(shipCoordinates1, FRIEND_OR_FOE.FOE, BOARD_NUMBER.TWO);

                        // Ships
                        expect(board2.children[1].className).toBe("cell foe");
                        expect(board2.children[2].className).toBe("cell foe");

                        expect(board2.children[8].className).toBe("cell foe");
                        expect(board2.children[18].className).toBe("cell foe");

                        // Shot-ship; these two should be marked hit when there is a conflict between hit and ship spaces
                        expect(board2.children[7].className).toBe("cell hit");
                        expect(board2.children[17].className).toBe("cell hit");
                    });
                });
            });

            describe("Fail tests: fillBoardElementShots", () => {
                test("Invalid board size: outer array wrong size", () => {
                    let badBoard = []; // Invalid size
                    expect(()=>{fillBoardElementShots(badBoard, FRIEND_OR_FOE.FRIEND, BOARD_NUMBER.ONE)}).toThrow();
                });

                test("Invalid board size: any inner array wrong size", () => {
                    let badBoard = [ // This has size 10 to pass test above
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [], // Will fail here
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        []
                    ]
                    expect(()=>{fillBoardElementShots(badBoard, FRIEND_OR_FOE.FRIEND, BOARD_NUMBER.ONE)}).toThrow();
                });

                test("Invalid shot value: any inner array value is not a valid shot value", () => {
                    const badBoard = [ // Right size of outer and inner arrays, but at least one invalid value
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,10000,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0]
                    ];

                    expect(()=>{fillBoardElementShots(badBoard, FRIEND_OR_FOE.FRIEND, BOARD_NUMBER.ONE)}).toThrow();
                });
            });

            describe("Fail tests: fillBoardElementShips", () => {
                // Clean up this the spyOn statement, apparently restoreAllMocks is standard practice
                // You can also define a spyOn with 'let spy = jest.spyOn(...)', and then only free it
                afterEach(()=>{
                    jest.restoreAllMocks();
                });

                test("Positions of ships contains a coordinate that produces an invalid cellNumber", () => {
                    jest.spyOn(Tools, "createIDNumberFromCoordinate").mockReturnValue(1000);

                    expect(()=>{fillBoardElementShips(board1Array, FRIEND_OR_FOE.FRIEND, BOARD_NUMBER.ONE)}).toThrow();
                });
            });
            
            describe("fillBoardElementsAll tests", () => {

                let shotsSpy;
                let shipsSpy;

                beforeAll(() => {
                    // We just need to test that the internal functions are called correctly, not their logic
                    shotsSpy = jest.spyOn(DOMManipulation, "fillBoardElementShots").mockImplementation(()=>{return});
                    shipsSpy = jest.spyOn(DOMManipulation, "fillBoardElementShips").mockImplementation(()=>{return});
                });

                afterAll(() => {
                    jest.restoreAllMocks();
                });

                test("Pass test", () => {
                    fillBoardElementsAll(1, 2, 3); // 1, 2, and 3 will be used to make sure execution order is correct

                    // Ensure the correct variables were used
                    expect(shipsSpy.mock.calls[0][0]).toBe(1);

                    expect(shotsSpy.mock.calls[0][0]).toBe(2);
                    expect(shotsSpy.mock.calls[1][0]).toBe(3);

                    // Ensure calls happened in the correct order
                    // First shots call is before ships call
                    expect(shotsSpy.mock.invocationCallOrder[0]).toBeLessThan(
                        shipsSpy.mock.invocationCallOrder[0]
                    );

                    // Second shots call is after ships call
                    expect(shipsSpy.mock.invocationCallOrder[0]).toBeLessThan(
                        shotsSpy.mock.invocationCallOrder[1]
                    );
                });

            });
        });
    });

    describe("placeShip event listener tests", () => {
        // Mock board for mocking eventListener
        const mockBoard = {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        }

        beforeAll(()=> {
            // Use the mockBoard for these tests
            UIState.getBoard1Element.mockReturnValue(mockBoard);
        });

        afterAll(()=> {
            // Restore the mock to return the file-local board
            UIState.getBoard1Element.mockReturnValue(board1);
        });

        test("enablePlaceShipHandlers: Pass", () => {
            enablePlaceShipHandlers();

            // This checks order, so if this would fail, check that the order matches the function
            expect(mockBoard.addEventListener.mock.calls).toEqual([
                ["mouseover", addPlaceShipClassHandler],
                ["mouseout", removePlaceShipClassHandler],
                ["wheel", wheelEventHandler]
            ]);
        });

        test("disablePlaceShipHandlers: Pass", () => {
            disablePlaceShipHandlers();

            // This checks order, so if this would fail, check that the order matches the function
            expect(mockBoard.removeEventListener.mock.calls).toEqual([
                ["mouseover", addPlaceShipClassHandler],
                ["mouseout", removePlaceShipClassHandler],
                ["wheel", wheelEventHandler]
            ]);
        });

    });

    describe("placeShip class tests", () => {
        // Variable setup
        Tools.setAdditionalToGetEachDirection(1);
        Tools.setSearchDirection(Tools.DIRECTION.HORIZONTAL);
        
        // Mock setup
        // spyOn() allows you to mock very specific things without having to do a jest.mock() call at the top of the file; see notes up there!
        beforeAll(()=>{
            jest.spyOn(Tools, "getIDNumberFromIDString").mockReturnValue(); // This call doesn't matter, but pretending it is expensive is good for practice with mocking
            jest.spyOn(Tools, "createIDListFromIDNumber").mockReturnValue([14, 15, 16]); // This mock's return value is used in both functions, so its value does matter
        });
        
        // These mocks would be needed for the jest.mock() version of mocking
        // Tools.getIDNumberFromIDString.mockReturnValue(); 
        // Tools.createIDListFromIDNumber.mockReturnValue([14, 15, 16]); 

        // Variables needed for tests to use as input
        let cell = {
            className: "cell friend",
            id: "boardX-cell15",
            classList: { 
                contains(searchFor) { // This is needed for the remove function because it uses cell.classList.contains() in its logic
                    let classes = cell.className.split(" ");
                    for (const c of classes) {
                        if (c === searchFor) {
                            return true;
                        }
                    }

                    return false;
                }
            }
           
        }
        
        let event = {target: cell}

        afterEach(()=> {
            cell.className = "cell friend";
            cell.id = "boardX-cell15";
        })

        describe("Add class tests", () => {
            test("Simple pass test", () => {
                addPlaceShipClassHandler(event);

                // Cells should have the placeShip class
                expect(board1.children[14].className).toBe("cell friend placeShip");
                expect(board1.children[15].className).toBe("cell friend placeShip");
                expect(board1.children[16].className).toBe("cell friend placeShip");
            });

            test("Bad className test", () => {
                cell.className = "bad className";

                addPlaceShipClassHandler(event);

                // Cells shouldn't have the placeShip class due to a bad className
                expect(board1.children[14].className).toBe("cell friend");
                expect(board1.children[15].className).toBe("cell friend");
                expect(board1.children[16].className).toBe("cell friend");
            });

        });

        describe("Remove class tests", () => {
            test("Simple pass test", () => {
                // Setup for removing the placeShip class from cells
                board1.children[14].classList.add("placeShip");
                board1.children[15].classList.add("placeShip");
                board1.children[15].classList.add("placeShip");
                cell.className = "cell friend placeShip"; // The target cell needs the placeShip class for this function to work
                
                removePlaceShipClassHandler(event);
               
                // The placeShip class should be removed
                expect(board1.children[14].className).toBe("cell friend");
                expect(board1.children[15].className).toBe("cell friend");
                expect(board1.children[16].className).toBe("cell friend");
            });

            test("Call on cell without placeShip class", () => {
                removePlaceShipClassHandler(event);
               
                // These cells should be unaffected by the function call
                expect(board1.children[14].className).toBe("cell friend");
                expect(board1.children[15].className).toBe("cell friend");
                expect(board1.children[16].className).toBe("cell friend");
            });
        });
    });

    describe("wheelEventHandler tests", () => {

        beforeAll(() => {
            // Clear mock objects so invocation call order can be used easily
            jest.clearAllMocks();
            
            // Just ensure these are all called, not their logic
            jest.spyOn(DOMManipulation, "removePlaceShipClassHandler").mockImplementation(()=>{return});
            jest.spyOn(DOMManipulation, "addPlaceShipClassHandler").mockImplementation(()=>{return});
            jest.spyOn(Tools, "switchSearchDirection").mockImplementation(()=>{return});
        });

        afterAll(() => {
            jest.restoreAllMocks();
        });

        test("Pass test", () => {
            wheelEventHandler(1); // Since everything is mocked, a very fake event can be passed

            expect(DOMManipulation.removePlaceShipClassHandler.mock.invocationCallOrder[0])
            .toBeLessThan(Tools.switchSearchDirection.mock.invocationCallOrder[0]);

            expect(Tools.switchSearchDirection.mock.invocationCallOrder[0])
            .toBeLessThan(DOMManipulation.addPlaceShipClassHandler.mock.invocationCallOrder[0]);
        });
    });

    describe("Add/remove 'ship' class to/from idList tests", () => {
        describe("addShipClassToIDList tests", () => {
            test("Simple pass", () => {
                let idList = [5, 6, 7];
                addShipClassToIDList(idList);

                expect(board1.children[5].className).toBe("cell ship");
                expect(board1.children[6].className).toBe("cell ship");
                expect(board1.children[7].className).toBe("cell ship");
            });

            test("ID beyond board limit (above and below)", () => {
                let idList = [500, -1];
                addShipClassToIDList(idList);
                // expect: No errors to occur
            });
            
        });

        describe("removeShipClassFromIDList tests", () => {
            test("Simple pass", () => {
                board1.children[5].classList.add("ship");
                board1.children[6].classList.add("ship");
                board1.children[7].classList.add("ship");

                board1.children[5].classList.remove("friend");
                board1.children[6].classList.remove("friend");
                board1.children[7].classList.remove("friend");

                let idList = [5, 6, 7];
                removeShipClassFromIDList(idList);

                expect(board1.children[5].className).toBe("cell friend");
                expect(board1.children[6].className).toBe("cell friend");
                expect(board1.children[7].className).toBe("cell friend");
            });

            test("ID beyond board limit (above and below)", () => {
                let idList = [500, -1];
                removeShipClassFromIDList(idList);
                // expect: No errors to occur
            });
        });
    });

    describe("Grab element tests", () => {
        describe("grabBoardElement tests", () => {
            describe("Pass tests", () => {
                test("board1", () => {
                    let ele = grabBoardElement(BOARD_NUMBER.ONE);
                    expect(ele).toBe(board1);
                });

                test("board2", () => {
                    let ele = grabBoardElement(BOARD_NUMBER.TWO);
                    expect(ele).toBe(board2);
                });
            });
            
            describe("Fail test", () => {
                test("invalid board number throws", () => {
                    expect(()=>{grabBoardElement(3)}).toThrow();
                });
            });
        });

        describe("grabButtonElement tests", () => {
            describe("Pass tests", () => {
                test("hideBoardsButton", () => {
                    let ele = grabButtonElement(BUTTON_NAMES.HIDE_BOARDS);
                    expect(ele).toBe(hideBoardsButton);
                });

                test("swapPlayersButton", () => {
                    let ele = grabButtonElement(BUTTON_NAMES.SWAP_PLAYERS);
                    expect(ele).toBe(swapPlayersButton);
                });

                test("revealBoardsButton", () => {
                    let ele = grabButtonElement(BUTTON_NAMES.REVEAL_BOARDS);
                    expect(ele).toBe(revealBoardsButton);
                });
            });
            
            describe("Fail test", () => {
                test("invalid button name throws", () => {
                    expect(()=>{grabButtonElement("invalid")}).toThrow();
                });
            });
        });
    });

    describe("initializePlayerButtons test", () => {
        test("Pass test", () => {
            initializePlayerButtons();

            expect(hideBoardsButton.disabled).toBe(true);
            expect(swapPlayersButton.disabled).toBe(true);
            expect(revealBoardsButton.disabled).toBe(true);

            // Test title length instead of specific titles to be more flexible
            expect(hideBoardsButton.title.length).toBeGreaterThan(0);
            expect(swapPlayersButton.title.length).toBeGreaterThan(0);
            expect(revealBoardsButton.title.length).toBeGreaterThan(0);
        });
    });

    describe("resetCellClassList tests", () => {
        let cell = {
            className: "cell classToBeRemoved",
            classList: {
                add(toAdd) {
                    cell.className = cell.className + " " + toAdd;
                }
            }
        }

        afterEach(() => {
            cell.className = "cell classToBeRemoved";
        });

        describe("Pass tests", () => {
            test("'friend' given", () => {
                resetCellClassList(cell, 'friend');

                expect(cell.className).toBe("cell friend");
            });

            test("'foe' given", () => {
                resetCellClassList(cell, 'foe');

                expect(cell.className).toBe("cell foe");
            });
        });

    });

    describe("friendOrFoeValidityCheck tests", () => {
        describe("Pass tests", () => {
            test("FRIEND_OR_FOE.FRIEND", () => {
                expect(()=>{friendOrFoeValidityCheck(FRIEND_OR_FOE.FRIEND)}).not.toThrow();
            });

            test("'friend' string", () => {
                expect(()=>{friendOrFoeValidityCheck('friend')}).not.toThrow();
            });

            test("FRIEND_OR_FOE.FOE", () => {
                expect(()=>{friendOrFoeValidityCheck(FRIEND_OR_FOE.FOE)}).not.toThrow();
            });

            test("'foe' string", () => {
                expect(()=>{friendOrFoeValidityCheck('foe')}).not.toThrow();
            });
        });

        describe("Fail tests", () => {
            test("Capitalization mistakes when using 'friend' and 'foe' strings throw errors", () => {
                
                expect(()=>{friendOrFoeValidityCheck("Friend")}).toThrow();
                expect(()=>{friendOrFoeValidityCheck("Foe")}).toThrow();

                expect(()=>{friendOrFoeValidityCheck("FRIEND")}).toThrow();
                expect(()=>{friendOrFoeValidityCheck("FOE")}).toThrow();
            });
            
            test("Any value other than FRIEND_OR_FOE.FRIEND/FOE (or string equivalent) throws an error", () => {
                
                // A few different random things
                expect(()=>{friendOrFoeValidityCheck(1)}).toThrow();
                expect(()=>{friendOrFoeValidityCheck("another string")}).toThrow();
                expect(()=>{friendOrFoeValidityCheck({})}).toThrow();
            });
        });
    });

});