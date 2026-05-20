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

document.body.appendChild(board1);
document.body.appendChild(board2);

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
UIState.getHideBoardsButton.mockReturnValue(hideButton);
UIState.getRevealBoardsButton.mockReturnValue(revealButton);
UIState.getSwapPlayersButton.mockReturnValue(swapButton);

UIState.getBoard2Element.mockReturnValue(board2);

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

                    // These three will be the same for each test
                    expect(Tools.getIDNumberFromIDString.mock.calls[0][0]).toBe("25");
                    expect(Tools.createCoordinateFromIDNumber.mock.calls[0][0]).toBe(25);
                    expect(GameEngine.shootAtCoordinate.mock.calls[0][0]).toEqual([5, 2]);

                    // Base Pass assumes the game doesn't end here, so the switch button is enabled
                    expect(DOMManipulation.enableButton.mock.calls).toHaveLength(1);

                    // Game doesn't end, so the disable call shouldn't have happened
                    expect(index.disableSwapProcessButtonEventListeners.mock.calls).toHaveLength(0);
                });

                test("Game should end after this shot", () => {
                    GameEngine.endGameCheck.mockReturnValueOnce(true);
                    index.shotListener(event);

                    // These three will be the same for each test
                    expect(Tools.getIDNumberFromIDString.mock.calls[0][0]).toBe("25");
                    expect(Tools.createCoordinateFromIDNumber.mock.calls[0][0]).toBe(25);
                    expect(GameEngine.shootAtCoordinate.mock.calls[0][0]).toEqual([5, 2]);
                    expect(index.disableSwapProcessButtonEventListeners.mock.calls).toHaveLength(1);

                    // Game should end, so the switch button shouldn't be enabled
                    expect(DOMManipulation.enableButton.mock.calls).toHaveLength(0);
                });
            });

            describe("Soft fail test", () => {
                test("Invalid shot causes an alert", () => {
                    let alertSpy = jest.spyOn(window, "alert").mockImplementation(()=>{return});
                    GameEngine.shootAtCoordinate.mockReturnValueOnce(false);

                    index.shotListener(event);

                    // These three will be the same for each test
                    expect(Tools.getIDNumberFromIDString.mock.calls[0][0]).toBe("25");
                    expect(Tools.createCoordinateFromIDNumber.mock.calls[0][0]).toBe(25);
                    expect(GameEngine.shootAtCoordinate.mock.calls[0][0]).toEqual([5, 2]);

                    // Expect an alert for the invalid shot
                    expect(window.alert.mock.calls).toHaveLength(1);

                    alertSpy.mockRestore();
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
});