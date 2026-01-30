/**
 * @jest-environment jsdom
 */

import { fillBoardElementShots, fillBoardElementShips, FRIEND_OR_FOE, BOARD_NUMBER } from "./DOMManipulation";

describe("DOMManipulation tests", () => {
    describe("Board tests", () => {
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
            board1.appendChild(cell.cloneNode());
            board2.appendChild(cell.cloneNode());
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
            for (let i = 0; i < 100; i++) {
                board1.children[i].classList.remove("miss", "hit", "friend", "foe", "ship");
                board2.children[i].classList.remove("miss", "hit", "friend", "foe", "ship");
            }
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
                        fillBoardElementShots(board1Array, FRIEND_OR_FOE.FOE, BOARD_NUMBER.ONE);

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

                    test("Just Ships - don't show ships", () => {
                        fillBoardElementShips(shipCoordinates1, FRIEND_OR_FOE.FOE, BOARD_NUMBER.ONE);

                        // Ships - since this test is done without the call to fillBoardElementShots, the foe class isn't present on the cells
                        expect(board1.children[1].className).toBe("cell");
                        expect(board1.children[2].className).toBe("cell");

                        expect(board1.children[8].className).toBe("cell");
                        expect(board1.children[18].className).toBe("cell");

                        expect(board1.children[7].className).toBe("cell");
                        expect(board1.children[17].className).toBe("cell");
                    });

                    test("Shots then Ships - don't show ships", () => {
                        fillBoardElementShots(board1Array, FRIEND_OR_FOE.FOE, BOARD_NUMBER.ONE);
                        fillBoardElementShips(shipCoordinates1, FRIEND_OR_FOE.FOE, BOARD_NUMBER.ONE);

                        // Ships - since this is at the foe board, these shouldn't be marked with ship
                        expect(board1.children[1].className).toBe("cell foe");
                        expect(board1.children[2].className).toBe("cell foe");

                        expect(board1.children[8].className).toBe("cell foe");
                        expect(board1.children[18].className).toBe("cell foe");

                        // Shot-ship; these two should be marked hit when there is a conflict between hit and ship spaces
                        expect(board1.children[7].className).toBe("cell hit");
                        expect(board1.children[17].className).toBe("cell hit");
                    });

                    test("Ships then Shots - don't show ships", () => {
                        fillBoardElementShots(board1Array, FRIEND_OR_FOE.FOE, BOARD_NUMBER.ONE);
                        fillBoardElementShips(shipCoordinates1, FRIEND_OR_FOE.FOE, BOARD_NUMBER.ONE);

                        // Ships
                        expect(board1.children[1].className).toBe("cell foe");
                        expect(board1.children[2].className).toBe("cell foe");

                        expect(board1.children[8].className).toBe("cell foe");
                        expect(board1.children[18].className).toBe("cell foe");

                        // Shot-ship; these two should be marked hit when there is a conflict between hit and ship spaces
                        expect(board1.children[7].className).toBe("cell hit");
                        expect(board1.children[17].className).toBe("cell hit");
                    });
                });
            });
            
            
        });
    });
});