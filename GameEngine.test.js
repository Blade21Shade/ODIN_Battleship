/**
 * @jest-environment jsdom
 */

import { getIDNumberOfClickedCell, processIDNumberOnBoard, revealBoardsCallback, getPreventProcessing} from "./GameEngine.js";

import { grabBoardElement } from "./DOMManipulation.js";

import Gameboard from "./Gameboard.js";

import * as GameState from "./GameState.js"
import * as UIState from "./UIState.js"

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

const board1Gameboard = new Gameboard(10);

const shipCoordinates1 = [
    [[1,0], [2,0]],
    [[7,0], [7,1]],
    [[8,0], [8,1]]
];

// Reset the board cell's to a clean classList for the next test
afterEach(() => {
    for (let i = 0; i < 100; i++) {
        board1.children[i].classList.remove("miss", "hit", "ship");
        board2.children[i].classList.remove("miss", "hit");

        board1.children[i].classList.add("friend");
        board2.children[i].classList.add("foe");
    }
});

describe("GameEngine tests", () => {
    describe("getIDNumberOfClickedCell tests", () => {
        // Elements that are evaluated
        let targetEle2Numbers = document.createElement("div");
        targetEle2Numbers.classList.add("cell", "foe");
        targetEle2Numbers.id = "board1-cell23";
        
        let targetEle1Number = document.createElement("div");
        targetEle1Number.classList.add("cell", "foe");
        targetEle1Number.id = "board1-cell5";

        let targetEleBadClassList = document.createElement("div");
        targetEleBadClassList.classList.add("cell", "friend");
        // No ID as tests should fail at the classList

        describe("Pass tests", () => {
            test("Cell number: 5", () => {
                expect(getIDNumberOfClickedCell(targetEle1Number)).toBe(5);
            });
            
            test("Cell number: 23", () => {
                expect(getIDNumberOfClickedCell(targetEle2Numbers)).toBe(23);
            });
        }); 

        describe("Clean-fail tests\nThese tests return a value, but that value represents a fail", ()=> {
            test("Bad classList - bad classes still return a value: -1", () => {
                expect(getIDNumberOfClickedCell(targetEleBadClassList)).toBe(-1);
            });
        });

    });

    describe("processClick tests", () => {
        describe("Pass tests", () => {
            test("idNumber: 5", () => {
                expect(processIDNumberOnBoard(5, board1Gameboard)).toBe(true); // Click is processed
            });
            
            test("idNumber: 23", () => {
                expect(processIDNumberOnBoard(23, board1Gameboard)).toBe(true); // Click is processed
            });
        });

        describe("Clean-fail tests - return false", () => {
            test("idNumber: -1; below 0-99 range", () => {
                expect(processIDNumberOnBoard(-1, board1Gameboard)).toBe(false);
            });
            
            test("idNumber: 100; above 0-99 range", () => {
                expect(processIDNumberOnBoard(100, board1Gameboard)).toBe(false);
            });

            test("idNumber: 5, 5; attempt to hit already fired at spot", () => {
                processIDNumberOnBoard(5, board1Gameboard);
                expect(processIDNumberOnBoard(5, board1Gameboard)).toBe(false);
            });
        }); 
    });

    describe("revealBoardsCallBack test", ()=> {
        // This test is integration I believe, but I've never done one before so I'm sure the practice is worth it

        // Variables needed for the function to run; also includes board1 and board2 from the top of the file
        const revealButton = document.createElement("button"); // This is disabled at the end of this function
        revealButton.id = "revealBoardsButton";

        // These buttons  aren't relevant to this test, but are necessary for UIState's initialization function to work
        let swapButton = document.createElement("button");
        swapButton.id = "swapPlayersButton";
        let hideButton = document.createElement("button");
        hideButton.id = "hideBoardsButton";

        document.body.appendChild(revealButton);
        document.body.appendChild(swapButton);
        document.body.appendChild(hideButton);

        test("The test", ()=>{
            // Initializations
            UIState.initializeUIState();
            GameState.initializeGameState();

            // Setting up variables for testing
            let player1Board = GameState.getPlayer1Board();
            let player2Board = GameState.getPlayer2Board();

            player1Board.placeShip([4, 0], [6, 0]); // board1.children[4-6]
            player1Board.fireAtBoard([6, 0]); // Hit; board1.children[6]
            player1Board.fireAtBoard([6, 1]); // Miss; board1.children[16]

            player2Board.fireAtBoard([0,0]); // Miss; at least one shot on this board so it can checked to see the load process working correctly

            // Actual test
            revealBoardsCallback();

            // Ship
            expect(board1.children[4].className).toBe("cell ship");
            expect(board1.children[5].className).toBe("cell ship");
            expect(board1.children[6].className).toBe("cell hit");

            // Missed shot on board1
            expect(board1.children[16].className).toBe("cell miss");

            // Missed shot on board2
            expect(board2.children[0].className).toBe("cell miss");

            // Variable checks
            expect(getPreventProcessing()).toBe(false);
            expect(revealButton.disabled).toBe(true);
        });
    });
});