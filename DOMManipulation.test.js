/**
 * @jest-environment jsdom
 */

import { fillBoardElementShots, fillBoardElementShips, FRIEND_OR_FOE, BOARD_NUMBER, addPlaceShipClassHandler, removePlaceShipClassHandler, addShipClassToIDList, removeShipClassFromIDList } from "./DOMManipulation";
import * as Tools from "./Tools.js";

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

const cell = document.createElement("div");
cell.classList.add("cell");

// Setup the boards for use
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

function setupFriendFoeCells() {
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
    setupFriendFoeCells();
});

describe("DOMManipulation tests", () => {
    describe("Board tests", () => {
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
            
            
        });
    });

    describe("shipPlace class tests", () => {
        // Variable setup
        Tools.setAdditionalToGetEachDirection(1);
        Tools.setSearchDirection(Tools.DIRECTION.HORIZONTAL);
        
        // Mock setup
        // spyOn() allows you to mock very specific things without having to do a jest.mock() call at the top of the file; see notes up there!
        jest.spyOn(Tools, "getIDNumberFromIDString").mockReturnValue(); // This call doesn't matter, but pretending it is expensive is good for practice with mocking
        jest.spyOn(Tools, "createIDListFromIDNumber").mockReturnValue([14, 15, 16]); // This mock's return value is used in both functions, so its value does matter
        
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
});