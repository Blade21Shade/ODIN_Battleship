/**
 * @jest-environment jsdom
 */

import * as index from "../src/index.js";
import * as Tools from "../src/Tools.js";
import * as GameEngine from "../src/GameEngine.js";
import * as DOMManipulation from "../src/DOMManipulation.js";
import * as UIState from "../src/UIState.js";
import * as GameSetup from "../src/GameSetup.js";
import * as GameState from "../src/GameState.js";

jest.mock("../src/Tools.js");
jest.mock("../src/GameEngine.js");
jest.mock("../src/DOMManipulation.js");
jest.mock("../src/UIState.js");
jest.mock("../src/GameSetup.js");
jest.mock("../src/GameState.js");

// Boards
const board1 = document.createElement("div");
board1.id = "board1";
const board2 = document.createElement("div");
board2.id = "board2";

const player1EndBoard = document.createElement("div");
const player2EndBoard = document.createElement("div");

function resetPlayerEndBoards() {
    player1EndBoard.replaceChildren();
    player2EndBoard.replaceChildren();

    const cell = document.createElement("div");
    cell.classList.toggle("cell");

    for (let i = 0; i < 100; i++) {
        let clone = cell.cloneNode();
        clone.id = `endGameBoard1-cell${i}`;
        player1EndBoard.appendChild(clone);

        clone = cell.cloneNode();
        clone.id = `endGameBoard2-cell${i}`;
        player2EndBoard.appendChild(clone);
    }
}

const shotsStatsPlayer1 = document.createElement("div");
shotsStatsPlayer1.title = "";
const shotsSpanPlayer1 = document.createElement("span");
shotsSpanPlayer1.innerText = "";
const hitsSpanPlayer1 = document.createElement("span");
hitsSpanPlayer1.innerText = "";
const missesSpanPlayer1 = document.createElement("span");
missesSpanPlayer1.innerText = "";
const hitPercentSpanPlayer1 = document.createElement("span");
hitPercentSpanPlayer1.innerText = "";
const hitsToWinSpanPlayer1 = document.createElement("span");
hitsToWinSpanPlayer1.innerText = "";

const shotsStatsPlayer2 = document.createElement("div");
shotsStatsPlayer2.title = "";
const shotsSpanPlayer2 = document.createElement("span");
shotsSpanPlayer2.innerText = "";
const hitsSpanPlayer2 = document.createElement("span");
hitsSpanPlayer2.innerText = "";
const missesSpanPlayer2 = document.createElement("span");
missesSpanPlayer2.innerText = "";
const hitPercentSpanPlayer2 = document.createElement("span");
hitPercentSpanPlayer2.innerText = "";
const hitsToWinSpanPlayer2 = document.createElement("span");
hitsToWinSpanPlayer2.innerText = "";

document.body.appendChild(board1);
document.body.appendChild(board2);
document.body.appendChild(player1EndBoard);
document.body.appendChild(player2EndBoard);

document.body.appendChild(shotsStatsPlayer1);
document.body.appendChild(shotsSpanPlayer1);
document.body.appendChild(hitsSpanPlayer1);
document.body.appendChild(missesSpanPlayer1);
document.body.appendChild(hitPercentSpanPlayer1);
document.body.appendChild(hitsToWinSpanPlayer1);

document.body.appendChild(shotsStatsPlayer2);
document.body.appendChild(shotsSpanPlayer2);
document.body.appendChild(hitsSpanPlayer2);
document.body.appendChild(missesSpanPlayer2);
document.body.appendChild(hitPercentSpanPlayer2);
document.body.appendChild(hitsToWinSpanPlayer2);

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

// Dialog isn't natively supported in Jest, this fixes that issue
// Comment by: RSeidelsohn on Jul 2, 2024
// https://github.com/jsdom/jsdom/issues/3294
HTMLDialogElement.prototype.show = jest.fn(function () {
	this.open = true;
});

HTMLDialogElement.prototype.showModal = jest.fn(function () {
	this.open = true;
});

HTMLDialogElement.prototype.close = jest.fn(function () {
	this.open = false;
});

// Dialog
const playAgainButton = document.createElement("button");
const endGameDialog = document.createElement("dialog");

jest.spyOn(endGameDialog, "showModal");
jest.spyOn(playAgainButton, "addEventListener");

endGameDialog.appendChild(playAgainButton);
document.body.appendChild(endGameDialog);

// Mocking for UIstate
UIState.getHideBoardsButton.mockReturnValue(hideButton);
UIState.getRevealBoardsButton.mockReturnValue(revealButton);
UIState.getSwapPlayersButton.mockReturnValue(swapButton);

UIState.getBoard2Element.mockReturnValue(board2);
UIState.getPlayer1EndBoard.mockReturnValue(player1EndBoard);
UIState.getPlayer2EndBoard.mockReturnValue(player2EndBoard);

UIState.getPlayAgainButton.mockReturnValue(playAgainButton);
UIState.getEndGameDialog.mockReturnValue(endGameDialog);

UIState.getShotsStatsPlayer1.mockReturnValue(shotsStatsPlayer1);
UIState.getShotsSpanPlayer1.mockReturnValue(shotsSpanPlayer1);
UIState.getHitsSpanPlayer1.mockReturnValue(hitsSpanPlayer1);
UIState.getMissesSpanPlayer1.mockReturnValue(missesSpanPlayer1);
UIState.getHitPercentSpanPlayer1.mockReturnValue(hitPercentSpanPlayer1);
UIState.getHitsToWinSpanPlayer1.mockReturnValue(hitsToWinSpanPlayer1);

UIState.getShotsStatsPlayer2.mockReturnValue(shotsStatsPlayer2);
UIState.getShotsSpanPlayer2.mockReturnValue(shotsSpanPlayer2);
UIState.getHitsSpanPlayer2.mockReturnValue(hitsSpanPlayer2);
UIState.getMissesSpanPlayer2.mockReturnValue(missesSpanPlayer2);
UIState.getHitPercentSpanPlayer2.mockReturnValue(hitPercentSpanPlayer2);
UIState.getHitsToWinSpanPlayer2.mockReturnValue(hitsToWinSpanPlayer2);

describe("index tests", () => {

    afterEach(()=>{
        jest.clearAllMocks();
    });

    describe("Initialize and reset tests", () => {
        test("initialize pass", () => {
            let setState = jest.spyOn(index, "setCurrentState").mockImplementation(()=>{return});
            let enableSwap = jest.spyOn(index, "enableSwapProcessButtonEventListeners").mockImplementation(()=>{return});
            let initDialog = jest.spyOn(index, "initializeDialogSubElements").mockImplementation(()=>{return});

            index.initialize();

            // Outside index.js calls
            expect(UIState.initializeUIState.mock.calls).toHaveLength(1);
            expect(GameState.initializeGameState.mock.calls).toHaveLength(1);
            expect(GameSetup.initializeOrReset.mock.calls).toHaveLength(1);
            expect(DOMManipulation.initializeBoardElements.mock.calls).toHaveLength(1);
            expect(DOMManipulation.initializePlayerButtons.mock.calls).toHaveLength(1);

            // Inside index.js calls
            expect(setState.mock.calls[0][0]).toEqual(index.SETUP_OR_GAMEPLAY.SETUP);
            expect(enableSwap.mock.calls).toHaveLength(1);
            expect(initDialog.mock.calls).toHaveLength(1);

            setState.mockRestore();
            enableSwap.mockRestore();
            initDialog.mockRestore();
        });

        test("reset pass", () => {
            let setState = jest.spyOn(index, "setCurrentState").mockImplementation(()=>{return});
            let resetDialogBoards = jest.spyOn(index, "resetEndGameDialogBoards").mockImplementation(()=>{return});
            let disableShot = jest.spyOn(index, "disableShotListener").mockImplementation(()=>{return});
            let enableSwap = jest.spyOn(index, "enableSwapProcessButtonEventListeners").mockImplementation(()=>{return});

            index.reset();

            // Outside index.js
            expect(GameState.initializeGameState.mock.calls).toHaveLength(1);
            expect(GameSetup.initializeOrReset.mock.calls).toHaveLength(1);
            expect(GameSetup.resetNumberOfPlayersThatHavePlacedAllShips.mock.calls).toHaveLength(1);
            expect(DOMManipulation.resetBoardElements.mock.calls).toHaveLength(1);

            // Inside index.js
            expect(setState.mock.calls[0][0]).toEqual(index.SETUP_OR_GAMEPLAY.SETUP);

            setState.mockRestore();
            resetDialogBoards.mockRestore();
            disableShot.mockRestore();
            enableSwap.mockRestore();
        });
    });

    describe("Shot listener tests", () => {
        describe("Enabling/disabling the shot listener tests", () => {
            // These will be spied on; they are declared so they can be mockRestored when tests finish
            let addListener;
            let removeListener;

            beforeAll(() => {
                addListener = jest.spyOn(board2, 'addEventListener');
                removeListener = jest.spyOn(board2, 'removeEventListener');
            });

            afterAll(() => {
                addListener.mockRestore();
                removeListener.mockRestore();
            });

            test("enableShotListener Pass", () => {
                index.enableShotListener();

                expect(board2.addEventListener.mock.calls[0]).toEqual(["click", index.shotListener]);
            });

            test("disableShotListener Pass", () => {
                index.disableShotListener();

                expect(board2.removeEventListener.mock.calls[0]).toEqual(["click", index.shotListener]);
            });
        });

        describe("shotListener tests", () => {

            let target = {
                id: "25"
            }

            let event = {
                target: target
            }

            let disableSwapSpy;
            let fillDialog;
            
            beforeAll(() => {
                Tools.getIDNumberFromIDString.mockReturnValue(25);
                Tools.createCoordinateFromIDNumber.mockReturnValue([5, 2]);

                GameState.getLastShotValue.mockReturnValue(1);
                
                GameEngine.shootAtCoordinate.mockReturnValue(true);
                GameEngine.endGameCheck.mockReturnValue(false);

                disableSwapSpy = jest.spyOn(index, "disableSwapProcessButtonEventListeners").mockImplementation(()=>{return});
                fillDialog = jest.spyOn(index, "fillEndGameDialog").mockImplementation(()=>{return});
            });

            afterEach(() => {
                jest.clearAllMocks();
            });

            afterAll(()=>{
                disableSwapSpy.mockRestore();
                fillDialog.mockRestore();
            });

            describe("Pass tests", () => {
                test("Base Pass", () => {
                    index.shotListener(event);

                    // These will be the same for each test
                    expect(Tools.getIDNumberFromIDString.mock.calls[0][0]).toBe("25");
                    expect(Tools.createCoordinateFromIDNumber.mock.calls[0][0]).toBe(25);
                    expect(GameEngine.shootAtCoordinate.mock.calls[0][0]).toEqual([5, 2]);
                    expect(DOMManipulation.addClassToCell.mock.calls[0][1]).toBe("hit");
                    expect(DOMManipulation.enableButton.mock.calls).toHaveLength(1);

                    // Game doesn't end, so the disable call shouldn't have happened
                    expect(index.disableSwapProcessButtonEventListeners.mock.calls).toHaveLength(0);
                });

                test("Missed shots pass correct value", () => {
                    GameState.getLastShotValue.mockReturnValueOnce(-1);
                    index.shotListener(event);

                    // Game shouldn't end
                    expect(DOMManipulation.addClassToCell.mock.calls[0][1]).toBe("miss"); // Different class
                    expect(DOMManipulation.enableButton.mock.calls).toHaveLength(1);

                    // Game doesn't end, so the disable call shouldn't have happened
                    expect(index.disableSwapProcessButtonEventListeners.mock.calls).toHaveLength(0);
                });

                test("Game should end after this shot", () => {
                    GameEngine.endGameCheck.mockReturnValueOnce(true);
                    index.shotListener(event);

                    // Game should end
                    expect(DOMManipulation.enableButton.mock.calls).toHaveLength(0);
                    expect(fillDialog.mock.calls).toHaveLength(1);

                    // Game ends so the disable call should happen
                    expect(index.disableSwapProcessButtonEventListeners.mock.calls).toHaveLength(1);
                });
            });

            describe("Soft fail tests", () => {
                let alertSpy;
                beforeAll(()=>{
                    GameState.getShotTakenThisTurn.mockReturnValue(false);
                    GameEngine.shootAtCoordinate.mockReturnValueOnce(false).mockReturnValueOnce(false);
                    alertSpy = jest.spyOn(window, "alert").mockImplementation(()=>{return});
                });

                afterAll(()=>{
                    alertSpy.mockRestore();
                });
                
                test("Invalid shot when a shot has not been taken this turn causes a specific alert message", () => {
                    index.shotListener(event);
                    expect(window.alert.mock.calls[0][0]).toEqual("Invalid shot, try another cell!");
                });

                test("Invalid shot when a shot has been taken this turn causes a specific alert message", () => {
                    GameState.getShotTakenThisTurn.mockReturnValueOnce(true);
                    index.shotListener(event);
                    expect(window.alert.mock.calls[0][0]).toEqual("Shot already taken, switch to next player!");
                });
            })
        });
    });

    describe("Swap process functions", () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        describe("Enable/disable event listeners", () => {
            beforeAll(()=>{
                jest.spyOn(hideButton, "addEventListener");
                jest.spyOn(swapButton, "addEventListener");
                jest.spyOn(revealButton, "addEventListener");

                jest.spyOn(hideButton, "removeEventListener");
                jest.spyOn(swapButton, "removeEventListener");
                jest.spyOn(revealButton, "removeEventListener");
            });

            test("enableSwapProcessButtonEventListeners: Base Pass", () => {
                index.enableSwapProcessButtonEventListeners();
                expect(hideButton.addEventListener.mock.calls[0]).toEqual(["click", index.hideBoardsCallback]);
                expect(swapButton.addEventListener.mock.calls[0]).toEqual(["click", index.swapPlayersCallback]);
                expect(revealButton.addEventListener.mock.calls[0]).toEqual(["click", index.revealBoardsCallback]);
            });

            test("disableSwapProcessButtonEventListeners: Base Pass", () => {
                index.disableSwapProcessButtonEventListeners();
                expect(hideButton.removeEventListener.mock.calls[0]).toEqual(["click", index.hideBoardsCallback]);
                expect(swapButton.removeEventListener.mock.calls[0]).toEqual(["click", index.swapPlayersCallback]);
                expect(revealButton.removeEventListener.mock.calls[0]).toEqual(["click", index.revealBoardsCallback]);
            });
        });
        
        describe("Callback functions", () => {
            let setStateMock;
            let enableShotMock;

            beforeAll( () => {
                GameSetup.getNumberOfPlayersThatHavePlacedAllShips.mockReturnValue(1);
                setStateMock = jest.spyOn(index, "setCurrentState");
                enableShotMock = jest.spyOn(index, "enableShotListener");
            });
            
            beforeEach(()=>{
                index.setCurrentState(index.SETUP_OR_GAMEPLAY.SETUP);
                jest.clearAllMocks(); // Remove the call above 
            });
            
            describe("hideBoardsCallback", () => {
                test("Base Pass: in Setup state", () => {
                    index.hideBoardsCallback();

                    // Inside SETUP block
                    expect(GameSetup.incrementNumberOfPlayersThatHavePlacedAllShips.mock.calls).toHaveLength(1);
                    expect(GameSetup.getNumberOfPlayersThatHavePlacedAllShips.mock.calls).toHaveLength(1);

                    // Inside block that's called if getNumber... gets 2
                    expect(index.setCurrentState.mock.calls).toHaveLength(0);
                    expect(index.enableShotListener.mock.calls).toHaveLength(0);

                    // Always occur
                    expect(DOMManipulation.resetBoardElements.mock.calls).toHaveLength(1);
                    expect(DOMManipulation.enableButton.mock.calls[0][0]).toBe(DOMManipulation.BUTTON_NAMES.SWAP_PLAYERS);
                    expect(DOMManipulation.disableButton.mock.calls[0][0]).toBe(DOMManipulation.BUTTON_NAMES.HIDE_BOARDS);
                });

                test("Swap from Setup to Gameplay state", () => {
                    GameSetup.getNumberOfPlayersThatHavePlacedAllShips.mockReturnValueOnce(2);
                    index.hideBoardsCallback();

                    // Inside SETUP block
                    expect(GameSetup.incrementNumberOfPlayersThatHavePlacedAllShips.mock.calls).toHaveLength(1);
                    expect(GameSetup.getNumberOfPlayersThatHavePlacedAllShips.mock.calls).toHaveLength(1);

                    // Inside block that's called if getNumber... gets 2
                    expect(index.setCurrentState.mock.calls).toHaveLength(1);
                    expect(index.enableShotListener.mock.calls).toHaveLength(1);
                });

                test("Already in GamePlay state", () => {
                    index.setCurrentState(index.SETUP_OR_GAMEPLAY.GAMEPLAY);
                    index.hideBoardsCallback();

                    // Inside SETUP block
                    expect(GameSetup.incrementNumberOfPlayersThatHavePlacedAllShips.mock.calls).toHaveLength(0);
                    expect(GameSetup.getNumberOfPlayersThatHavePlacedAllShips.mock.calls).toHaveLength(0);
                });
            });

            describe("swapPlayersCallback", () => {
                test("Base pass", () => {
                    index.swapPlayersCallback();

                    expect(DOMManipulation.enableButton.mock.calls[0][0]).toBe(DOMManipulation.BUTTON_NAMES.REVEAL_BOARDS);
                    expect(DOMManipulation.disableButton.mock.calls[0][0]).toBe(DOMManipulation.BUTTON_NAMES.SWAP_PLAYERS); 

                    expect(GameState.switchCurrentPlayerState.mock.calls).toHaveLength(1);
                });
            });

            describe("revealBoardsCallback", () => {
                test("Base Pass: In setup state", () => {
                    index.revealBoardsCallback();

                    // In Setup state
                    expect(GameSetup.initializeOrReset.mock.calls).toHaveLength(1);

                    // Gameplay state skipped
                    expect(GameState.getShotsAndShipsArrays.mock.calls).toHaveLength(0);
                    expect(DOMManipulation.fillBoardElementsAll.mock.calls).toHaveLength(0);
                    expect(GameState.setShotTakenThisTurn.mock.calls).toHaveLength(0);

                    // Always happens
                    expect(DOMManipulation.disableButton.mock.calls[0][0]).toBe(DOMManipulation.BUTTON_NAMES.REVEAL_BOARDS);
                });

                test("Pass: In Gameplay state", () => {
                    GameState.getShotsAndShipsArrays.mockReturnValueOnce(
                        {friendShipsPositionsArray: [],
                        friendShotsPositionsArray: [],
                        foeShotsPositionsArray: []}
                    )
                    index.setCurrentState(index.SETUP_OR_GAMEPLAY.GAMEPLAY);
                    index.revealBoardsCallback();

                    // Setup state skipped
                    expect(GameSetup.initializeOrReset.mock.calls).toHaveLength(0);

                    // In Gameplay state
                    expect(GameState.getShotsAndShipsArrays.mock.calls).toHaveLength(1);
                    expect(DOMManipulation.fillBoardElementsAll.mock.calls).toHaveLength(1);
                    expect(GameState.setShotTakenThisTurn.mock.calls).toHaveLength(1);
                });
            });

        });
    });

    describe("Dialog tests", () => {
        describe("Shared function tests", () => {
            // Remove the children
            afterEach(() => {
                player1EndBoard.replaceChildren();
                player2EndBoard.replaceChildren();
            });
            
            describe("initializeDialogSubElements test", () => {
                test("Base pass", ()=> {
                    index.initializeDialogSubElements();

                    // Check boards are the right size
                    expect(player1EndBoard.childElementCount).toBe(100);
                    expect(player2EndBoard.childElementCount).toBe(100);

                    // Buttons
                });
            });
        });
        
        describe("End of game dialog tests", () => {
            GameState.getShotsAndShipsArrays.mockReturnValue({friendShipsPositionsArray: [], friendShotsPositionsArray: [], foeShotsPositionsArray: []});
            
            beforeEach(()=>{
                resetPlayerEndBoards();
            });

            afterEach(()=>{
                jest.clearAllMocks();
            });

            describe("fillEndGameDialog tests", () => {
                let boardSpy = jest.spyOn(index, "fillEndGameDialogBoard").mockImplementation(()=>{return});
                let statsSpy = jest.spyOn(index, "fillEndGameDialogStats").mockImplementation(()=>{return});

                afterAll(()=> {
                    boardSpy.mockRestore();
                    statsSpy.mockRestore();
                });
                
                test("Base pass", () => {
                    index.fillEndGameDialog();

                    expect(boardSpy.mock.calls[0][0]).toBe(1);
                    expect(boardSpy.mock.calls[1][0]).toBe(2);

                    expect(statsSpy.mock.calls[0][0]).toBe(1);
                    expect(statsSpy.mock.calls[1][0]).toBe(2);

                    // Ensure board filling occurs before stats filling
                    expect(boardSpy.mock.invocationCallOrder[0]).toBeLessThan(statsSpy.mock.invocationCallOrder[0]);
                    expect(boardSpy.mock.invocationCallOrder[0]).toBeLessThan(statsSpy.mock.invocationCallOrder[1]);

                    expect(boardSpy.mock.invocationCallOrder[1]).toBeLessThan(statsSpy.mock.invocationCallOrder[0]);
                    expect(boardSpy.mock.invocationCallOrder[1]).toBeLessThan(statsSpy.mock.invocationCallOrder[1]);
                });
            });

            describe("fillEndGameDialogBoard tests", () => {
                test("Base pass: 1 affects player 1 board", () => {
                    index.fillEndGameDialogBoard(1);
                    
                    expect(DOMManipulation.fillBoardElementShots.mock.calls[0][2]).toEqual(player1EndBoard);
                    expect(DOMManipulation.fillBoardElementShips.mock.calls[0][2]).toEqual(player1EndBoard);
                });

                test("2 affects player 2 board", () => {
                    index.fillEndGameDialogBoard(2);
                    
                    expect(DOMManipulation.fillBoardElementShots.mock.calls[0][2]).toEqual(player2EndBoard);
                    expect(DOMManipulation.fillBoardElementShips.mock.calls[0][2]).toEqual(player2EndBoard);
                });

                test("Number other than 1 or 2 throws", () => {
                    expect(()=>{index.fillEndGameDialogBoard(0)}).toThrow();
                    expect(()=>{index.fillEndGameDialogBoard(3)}).toThrow();
                });
            });

            describe("fillEndGameDialogStats tests", () => {
                test("Base pass: Passing 1 targets player 1", () => {
                    index.fillEndGameDialogStats(1);

                    // Player 1 stuff is called
                    expect(UIState.getShotsStatsPlayer1.mock.calls).toHaveLength(1);
                    expect(UIState.getShotsSpanPlayer1.mock.calls).toHaveLength(1);
                    expect(UIState.getHitsSpanPlayer1.mock.calls).toHaveLength(1);
                    expect(UIState.getMissesSpanPlayer1.mock.calls).toHaveLength(1);
                    expect(UIState.getHitPercentSpanPlayer1.mock.calls).toHaveLength(1);
                    expect(UIState.getHitsToWinSpanPlayer1.mock.calls).toHaveLength(1);
                    expect(UIState.getPlayer2EndBoard.mock.calls).toHaveLength(1);

                    // Player 2 stuff is not called
                    expect(UIState.getShotsStatsPlayer2.mock.calls).toHaveLength(0);
                    expect(UIState.getShotsSpanPlayer2.mock.calls).toHaveLength(0);
                    expect(UIState.getHitsSpanPlayer2.mock.calls).toHaveLength(0);
                    expect(UIState.getMissesSpanPlayer2.mock.calls).toHaveLength(0);
                    expect(UIState.getHitPercentSpanPlayer2.mock.calls).toHaveLength(0);
                    expect(UIState.getHitsToWinSpanPlayer2.mock.calls).toHaveLength(0);
                    expect(UIState.getPlayer1EndBoard.mock.calls).toHaveLength(0);

                    // Expect player 1 stuff to have information filled correctly
                    /* In this test everything will be 0, another test will check actual values*/

                    expect(shotsStatsPlayer1.title).toEqual("Stats are for shots at opponent's board");
                    expect(shotsSpanPlayer1.innerText).toEqual(0);
                    expect(hitsSpanPlayer1.innerText).toEqual(0);
                    expect(missesSpanPlayer1.innerText).toEqual(0);
                    expect(hitPercentSpanPlayer1.innerText).toEqual(NaN); // There is a /0 here, so NaN is produced
                    expect(hitsToWinSpanPlayer1.innerText).toEqual(17); // 17 is the sum of the length of all ships; 0 hits would need 17 more to win
                });

                test("Passing 2 targets player 2", () => {
                    index.fillEndGameDialogStats(2);

                    // Player 1 stuff is not called
                    expect(UIState.getShotsStatsPlayer1.mock.calls).toHaveLength(0);
                    expect(UIState.getShotsSpanPlayer1.mock.calls).toHaveLength(0);
                    expect(UIState.getHitsSpanPlayer1.mock.calls).toHaveLength(0);
                    expect(UIState.getMissesSpanPlayer1.mock.calls).toHaveLength(0);
                    expect(UIState.getHitPercentSpanPlayer1.mock.calls).toHaveLength(0);
                    expect(UIState.getHitsToWinSpanPlayer1.mock.calls).toHaveLength(0);
                    expect(UIState.getPlayer2EndBoard.mock.calls).toHaveLength(0);

                    // Player 2 stuff is called
                    expect(UIState.getShotsStatsPlayer2.mock.calls).toHaveLength(1);
                    expect(UIState.getShotsSpanPlayer2.mock.calls).toHaveLength(1);
                    expect(UIState.getHitsSpanPlayer2.mock.calls).toHaveLength(1);
                    expect(UIState.getMissesSpanPlayer2.mock.calls).toHaveLength(1);
                    expect(UIState.getHitPercentSpanPlayer2.mock.calls).toHaveLength(1);
                    expect(UIState.getHitsToWinSpanPlayer2.mock.calls).toHaveLength(1);
                    expect(UIState.getPlayer1EndBoard.mock.calls).toHaveLength(1);

                    // Expect player 1 stuff to have information filled correctly
                    /* In this test everything will be 0, another test will check actual values*/

                    expect(shotsStatsPlayer2.title).toEqual("Stats are for shots at opponent's board");
                    expect(shotsSpanPlayer2.innerText).toEqual(0);
                    expect(hitsSpanPlayer2.innerText).toEqual(0);
                    expect(missesSpanPlayer2.innerText).toEqual(0);
                    expect(hitPercentSpanPlayer2.innerText).toEqual(NaN);
                    expect(hitsToWinSpanPlayer2.innerText).toEqual(17); // 17 is the sum of the length of all ships; 0 hits would need 17 more to win
                });

                test("Shot-at board cells math is correct", () => {
                    player2EndBoard.children[0].classList.add("hit");
                    player2EndBoard.children[1].classList.add("hit");
                    player2EndBoard.children[2].classList.add("hit");
                    player2EndBoard.children[3].classList.add("hit");
                    player2EndBoard.children[4].classList.add("hit");
                    player2EndBoard.children[5].classList.add("hit");
                    player2EndBoard.children[6].classList.add("hit");

                    player2EndBoard.children[7].classList.add("miss");
                    player2EndBoard.children[8].classList.add("miss");
                    player2EndBoard.children[9].classList.add("miss");
                    
                    index.fillEndGameDialogStats(1);

                    // Expect player 1 stuff to have information filled correctly
                    expect(shotsStatsPlayer1.title).toEqual("Stats are for shots at opponent's board");
                    expect(shotsSpanPlayer1.innerText).toEqual(10);
                    expect(hitsSpanPlayer1.innerText).toEqual(7);
                    expect(missesSpanPlayer1.innerText).toEqual(3);
                    expect(hitPercentSpanPlayer1.innerText).toEqual(70);
                    expect(hitsToWinSpanPlayer1.innerText).toEqual(10); // 17 - 7 = 10
                });
            });

            describe("resetEndGameDialogBoards tests", () => {
                test("Base Pass", () => {
                    for (let i = 0; i < 10; i++) {
                        player1EndBoard.children[i].className = "bad";
                        player2EndBoard.children[i].className = "bad";
                    }

                    index.resetEndGameDialogBoards();

                    for (let i = 0; i < 10; i++) {
                        expect(player1EndBoard.children[i].className).toEqual("cell");
                        expect(player2EndBoard.children[i].className).toEqual("cell");
                    }
                });
            });
        });
    });
});