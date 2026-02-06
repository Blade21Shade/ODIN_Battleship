/**
 * @jest-environment jsdom
 */

jest.mock("./DOMManipulation", () => ({
    grabBoardElement: jest.fn(()=>"testVal")
}));

import { getIDNumberOfClickedCell, processIDNumberOnBoard} from "./GameEngine.js";

import { grabBoardElement } from "./DOMManipulation.js";

import Gameboard from "./Gameboard.js";

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

beforeEach(() => {
    let brd1 = document.querySelector("#board1");
    let brd2 = document.querySelector("#board2");

    grabBoardElement
    .mockImplementationOnce(()=>brd1)
    .mockImplementationOnce(()=>brd2);
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
                expect(processIDNumberOnBoard(23, board1Gameboard)).toBe(false);
            });

            test("idNumber: 5, 5; attempt to hit already fired at spot", () => {
                processIDNumberOnBoard(5, board1Gameboard);
                expect(processIDNumberOnBoard(5, board1Gameboard)).toBe(false);
            });
        }); 
    });
});