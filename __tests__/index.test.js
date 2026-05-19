/**
 * @jest-environment jsdom
 */

import * as index from "../src/index.js";
import * as Tools from "../src/Tools.js";
import * as GameEngine from "../src/GameEngine.js";
import * as DOMManipulation from "../src/DOMManipulation.js";
import * as UIState from "../src/UIState.js";

jest.mock("../src/Tools.js");
jest.mock("../src/GameEngine.js");
jest.mock("../src/DOMManipulation.js");
jest.mock("../src/UIState.js");

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
            
            beforeAll(() => {
                Tools.getIDNumberFromIDString.mockReturnValue(25);
                Tools.createCoordinateFromIDNumber.mockReturnValue([5, 2]);
                
                GameEngine.shootAtCoordinate.mockReturnValue(true);
                GameEngine.endGameCheck.mockReturnValue(false);
            });

            afterEach(() => {
                jest.clearAllMocks();
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
                });

                test("Game should end after this shot", () => {
                    GameEngine.endGameCheck.mockReturnValueOnce(true);
                    index.shotListener(event);

                    // These three will be the same for each test
                    expect(Tools.getIDNumberFromIDString.mock.calls[0][0]).toBe("25");
                    expect(Tools.createCoordinateFromIDNumber.mock.calls[0][0]).toBe(25);
                    expect(GameEngine.shootAtCoordinate.mock.calls[0][0]).toEqual([5, 2]);

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
});