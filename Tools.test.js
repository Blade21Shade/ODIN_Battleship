import {getIDNumberFromIDString, createIDListFromIDNumber, setAdditionalToGetEachDirection, setSearchDirection, DIRECTION} from "./Tools"

describe("Tools tests", () => {
    describe("getIDNumberFromIDString tests", () => {
        test("One number: test1", () => {
            expect(getIDNumberFromIDString("test1")).toBe(1);
        });
        
        test("Two numbers: test12", () => {
            expect(getIDNumberFromIDString("test12")).toBe(12);
        });

        test("Fail test: Last character isn't a number, 1 ending character; testA", () => {
            expect(getIDNumberFromIDString("testA")).toBe(-1);
        });

        test("Fail test: Last character isn't a number, 2 ending characters; test1A", () => {
            expect(getIDNumberFromIDString("test1A")).toBe(-1);
        });
    });
    
    describe("createIDListFromIDNumber tests", () => {
        let cellID = 0;

        describe("Hard success tests - These return lists of the right size, values are in the valid range", () => {
            describe("2-cell sized ship limits", () => {
                test("ID: 0, Direction: horizontal, AdditionalReach: 0", () => { // Top left corner, checking for 2-cell ship
                    cellID = 0;
                    setSearchDirection(DIRECTION.HORIZONTAL);
                    setAdditionalToGetEachDirection(0);
                    expect(createIDListFromIDNumber(cellID)).toEqual([0, 1]);
                });

                test("ID: 0, Direction: vertical, AdditionalReach: 0", () => {
                    cellID = 0;
                    setSearchDirection(DIRECTION.VERTICAL);
                    setAdditionalToGetEachDirection(0);
                    expect(createIDListFromIDNumber(cellID)).toEqual([0, 10]);
                });

                test("ID: 98, Direction: horizontal, AdditionalReach: 0", () => { // Last position where 2-cell can be placed horizontally; every X8 could slot here
                    cellID = 98;
                    setSearchDirection(DIRECTION.HORIZONTAL);
                    setAdditionalToGetEachDirection(0);
                    expect(createIDListFromIDNumber(cellID)).toEqual([98, 99]);
                });

                test("ID: 89, Direction: vertical, AdditionalReach: 0", () => { // Last position where the 2-cell can be placed vertically: every 8X could slot here
                    cellID = 89;
                    setSearchDirection(DIRECTION.VERTICAL);
                    setAdditionalToGetEachDirection(0);
                    expect(createIDListFromIDNumber(cellID)).toEqual([89, 99]);
                });
            });

            describe("Valid placement of a non 2-cell ship", () => {
                test("ID: 55, Direction: horizontal, AdditionalReach: 2", () => { // 55 is in the middle area of the board, meaning reach can happen in both directions
                    cellID = 55;
                    setSearchDirection(DIRECTION.HORIZONTAL);
                    setAdditionalToGetEachDirection(2);
                    expect(createIDListFromIDNumber(cellID)).toEqual([55, 56, 54, 57, 53]); // The function adds values in a specific order, see note in the function for specifics
                });

                test("ID: 55, Direction: vertical, AdditionalReach: 2", () => {
                    cellID = 55;
                    setSearchDirection(DIRECTION.VERTICAL);
                    setAdditionalToGetEachDirection(2);
                    expect(createIDListFromIDNumber(cellID)).toEqual([55, 65, 45, 75, 35]); // Same as above
                });
            });
        });

        describe("Soft fail tests - These return lists of the wrong size, values are still in the valid range", () => {
            describe("Invalid 2-cell sized ship placement positions", () => {
                test("ID: 19, Direction: horizontal, AdditionalReach: 0", () => { // Reach to 20, which is invalid; every X0 could slot here (not including just 0)
                    cellID = 19;
                    setSearchDirection(DIRECTION.HORIZONTAL);
                    setAdditionalToGetEachDirection(0);
                    expect(createIDListFromIDNumber(cellID)).toEqual([19]);
                });

                test("ID: 90, Direction: vertical, AdditionalReach: 0", () => { // Reach to 100, which is invalid; every X0 could slot here
                    cellID = 90;
                    setSearchDirection(DIRECTION.VERTICAL);
                    setAdditionalToGetEachDirection(0);
                    expect(createIDListFromIDNumber(cellID)).toEqual([90]);
                });
            });
            
            describe("Invalid horizontal placements", () => {
                test("ID: 10, Direction: horizontal, AdditionalReach: 2", () => { // Reaches to 8, 9, invalid wrapping; all X0 could slot here
                    cellID = 10;
                    setSearchDirection(DIRECTION.HORIZONTAL);
                    setAdditionalToGetEachDirection(2);
                    expect(createIDListFromIDNumber(cellID)).toEqual([10, 11, 12]);
                });

                test("ID: 19, Direction: horizontal, AdditionalReach: 2", () => { // Reaches to 20, 21, invalid wrapping; all X9 could slot here
                    cellID = 19;
                    setSearchDirection(DIRECTION.HORIZONTAL);
                    setAdditionalToGetEachDirection(2);
                    expect(createIDListFromIDNumber(cellID)).toEqual([19, 18, 17]);
                });
            });

            describe("Invalid vertical placements", () => {
                test("ID: 0, Direction: vertical, AdditionalReach: 2", () => { // Reaches to 8, 9, invalid wrapping; all X0 could slot here
                    cellID = 0;
                    setSearchDirection(DIRECTION.VERTICAL);
                    setAdditionalToGetEachDirection(2);
                    expect(createIDListFromIDNumber(cellID)).toEqual([0, 10, 20]);
                });

                test("ID: 19, Direction: vertical, AdditionalReach: 2", () => { // Reaches to 20, 21, invalid wrapping; all X9 could slot here
                    cellID = 90;
                    setSearchDirection(DIRECTION.VERTICAL);
                    setAdditionalToGetEachDirection(2);
                    expect(createIDListFromIDNumber(cellID)).toEqual([90, 80, 70]);
                });
            });
        });
    });
});
