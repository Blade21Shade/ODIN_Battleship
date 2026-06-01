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

document.body.appendChild(board1);
document.body.appendChild(board2);
document.body.appendChild(player1EndBoard);
document.body.appendChild(player2EndBoard);

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

describe("index tests", () => {

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
            
            beforeAll(() => {
                Tools.getIDNumberFromIDString.mockReturnValue(25);
                Tools.createCoordinateFromIDNumber.mockReturnValue([5, 2]);

                GameState.getLastShotValue.mockReturnValue(1);
                
                GameEngine.shootAtCoordinate.mockReturnValue(true);
                GameEngine.endGameCheck.mockReturnValue(false);

                disableSwapSpy = jest.spyOn(index, "disableSwapProcessButtonEventListeners");
            });

            afterEach(() => {
                jest.clearAllMocks();
            });

            afterAll(()=>{
                disableSwapSpy.mockRestore();
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
            
            describe("fillEndGameDialog tests", () => {
                test("Base pass", () => {
                    index.fillEndGameDialog();

                    expect(DOMManipulation.fillBoardElementShots.mock.calls[0][2]).toEqual(player1EndBoard);
                    expect(DOMManipulation.fillBoardElementShips.mock.calls[0][2]).toEqual(player1EndBoard);

                    expect(DOMManipulation.fillBoardElementShots.mock.calls[0][2]).toEqual(player2EndBoard);
                    expect(DOMManipulation.fillBoardElementShips.mock.calls[0][2]).toEqual(player2EndBoard);
                });
            });
        });
    });
});