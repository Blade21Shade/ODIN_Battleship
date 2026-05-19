/**
 * @jest-environment jsdom
 */

import * as UIState from "../src/UIState.js"

// selectXLengthShipButton elements
const select2LengthShipButton = document.createElement("button");
select2LengthShipButton.id = "select2LengthShipButton";
document.body.appendChild(select2LengthShipButton);

const select3LengthShipButton = document.createElement("button");
select3LengthShipButton.id = "select3LengthShipButton";
document.body.appendChild(select3LengthShipButton);

const select4LengthShipButton = document.createElement("button");
select4LengthShipButton.id = "select4LengthShipButton";
document.body.appendChild(select4LengthShipButton);

const select5LengthShipButton = document.createElement("button");
select5LengthShipButton.id = "select5LengthShipButton";
document.body.appendChild(select5LengthShipButton);

// Call this so the variables in UIState link to the variables here
UIState.initializeUIState();

describe("setCurrentlySelectedXLengthShipButton tests", () => {
    afterEach(()=> {
        // Always use 2 as a baseline
        UIState.setCurrentlySelectedXLengthShipButton(2);
    });
    
    test("Pass", () => {
        // Check that each length returns the correct button
        UIState.setCurrentlySelectedXLengthShipButton(2);
        expect(UIState.getCurrentlySelectedXLengthShipButtonID()).toBe(select2LengthShipButton.id);

        UIState.setCurrentlySelectedXLengthShipButton(3);
        expect(UIState.getCurrentlySelectedXLengthShipButtonID()).toBe(select3LengthShipButton.id);

        UIState.setCurrentlySelectedXLengthShipButton(4);
        expect(UIState.getCurrentlySelectedXLengthShipButtonID()).toBe(select4LengthShipButton.id);

        UIState.setCurrentlySelectedXLengthShipButton(5);
        expect(UIState.getCurrentlySelectedXLengthShipButtonID()).toBe(select5LengthShipButton.id);
    });

    describe("Fail tests", () => {
        test("Number not in valid range", () => {
            // Below
            expect(()=>UIState.setCurrentlySelectedXLengthShipButton(1)).toThrow();
            // Above
            expect(()=>UIState.setCurrentlySelectedXLengthShipButton(6)).toThrow();
        });

        test("Non-number given", () => {
            expect(()=>UIState.setCurrentlySelectedXLengthShipButton("s")).toThrow();
        });
    });
});