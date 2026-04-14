import {getIDNumberFromIDString, createIDListFromIDNumber, setAdditionalToGetEachDirection, setSearchDirection, DIRECTION, createCoordinateFromIDNumber, createIDNumberFromCoordinate, addIDsToEachSideOfIDList,setWorkingShipLength} from "./Tools"

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
                test("ID: 0, Direction: horizontal, Working ship length: 2", () => { // Top left corner, checking for 2-cell ship
                    cellID = 0;
                    setSearchDirection(DIRECTION.HORIZONTAL);
                    setWorkingShipLength(2);
                    expect(createIDListFromIDNumber(cellID)).toEqual([0, 1]);
                });

                test("ID: 0, Direction: vertical, Working ship length: 2", () => {
                    cellID = 0;
                    setSearchDirection(DIRECTION.VERTICAL);
                    setWorkingShipLength(2);
                    expect(createIDListFromIDNumber(cellID)).toEqual([0, 10]);
                });

                test("ID: 98, Direction: horizontal, Working ship length: 2", () => { // Last position where 2-cell can be placed horizontally; every X8 could slot here
                    cellID = 98;
                    setSearchDirection(DIRECTION.HORIZONTAL);
                    setWorkingShipLength(2);
                    expect(createIDListFromIDNumber(cellID)).toEqual([98, 99]);
                });

                test("ID: 89, Direction: vertical, Working ship length: 2", () => { // Last position where the 2-cell can be placed vertically: every 8X could slot here
                    cellID = 89;
                    setSearchDirection(DIRECTION.VERTICAL);
                    setWorkingShipLength(2);
                    expect(createIDListFromIDNumber(cellID)).toEqual([89, 99]);
                });
            });

            describe("Valid placement of a non 2-cell ship", () => {
                describe("Odd length ships", () => {
                    test("ID: 55, Direction: horizontal, Working ship length: 5", () => { // 55 is in the middle area of the board, meaning reach can happen in both directions
                        cellID = 55;
                        setSearchDirection(DIRECTION.HORIZONTAL);
                        setWorkingShipLength(5);
                        expect(createIDListFromIDNumber(cellID)).toEqual([53, 54, 55, 56, 57]);
                    });

                    test("ID: 55, Direction: vertical, Working ship length: 5", () => {
                        cellID = 55;
                        setSearchDirection(DIRECTION.VERTICAL);
                        setWorkingShipLength(5);
                        expect(createIDListFromIDNumber(cellID)).toEqual([35, 45, 55, 65, 75]);
                    });
                });
                
                describe("Even length ships", () => {
                    test("ID: 55, Direction: vertical, Working ship length: 4", () => {
                        cellID = 55;
                        setSearchDirection(DIRECTION.VERTICAL);
                        setWorkingShipLength(4);
                        expect(createIDListFromIDNumber(cellID)).toEqual([45, 55, 65, 75]);
                    });

                    test("ID: 55, Direction: horizontal, Working ship length: 4", () => {
                        cellID = 55;
                        setSearchDirection(DIRECTION.HORIZONTAL);
                        setWorkingShipLength(4);
                        expect(createIDListFromIDNumber(cellID)).toEqual([54, 55, 56, 57]);
                    });
                });
            });
        });

        describe("Soft fail tests - These return lists of the wrong size, values are still in the valid range", () => {
            describe("Invalid 2-cell sized ship placement positions", () => {
                test("ID: 19, Direction: horizontal, Working ship length: 2", () => { // Reach to 20, which is invalid; every X0 could slot here (not including just 0)
                    cellID = 19;
                    setSearchDirection(DIRECTION.HORIZONTAL);
                    setWorkingShipLength(2);
                    expect(createIDListFromIDNumber(cellID)).toEqual([19]);
                });

                test("ID: 90, Direction: vertical, Working ship length: 2", () => { // Reach to 100, which is invalid; every X0 could slot here
                    cellID = 90;
                    setSearchDirection(DIRECTION.VERTICAL);
                    setWorkingShipLength(2);
                    expect(createIDListFromIDNumber(cellID)).toEqual([90]);
                });
            });
            
            describe("Invalid horizontal placements", () => {
                test("ID: 10, Direction: horizontal, Working ship length: 5", () => { // Reaches to 8, 9, invalid wrapping; all X0 could slot here
                    cellID = 10;
                    setSearchDirection(DIRECTION.HORIZONTAL);
                    setWorkingShipLength(5);
                    expect(createIDListFromIDNumber(cellID)).toEqual([10, 11, 12]);
                });

                test("ID: 19, Direction: horizontal, Working ship length: 5", () => { // Reaches to 20, 21, invalid wrapping; all X9 could slot here
                    cellID = 19;
                    setSearchDirection(DIRECTION.HORIZONTAL);
                    setWorkingShipLength(5);
                    expect(createIDListFromIDNumber(cellID)).toEqual([17, 18, 19]);
                });
            });

            describe("Invalid vertical placements", () => {
                test("ID: 0, Direction: vertical, Working ship length: 5", () => { // Reaches to 8, 9, invalid wrapping; all X0 could slot here
                    cellID = 0;
                    setSearchDirection(DIRECTION.VERTICAL);
                    setWorkingShipLength(5);
                    expect(createIDListFromIDNumber(cellID)).toEqual([0, 10, 20]);
                });

                test("ID: 19, Direction: vertical, Working ship length: 5", () => { // Reaches to 20, 21, invalid wrapping; all X9 could slot here
                    cellID = 90;
                    setSearchDirection(DIRECTION.VERTICAL);
                    setWorkingShipLength(5);
                    expect(createIDListFromIDNumber(cellID)).toEqual([70, 80, 90]);
                });
            });
        });
    });

    describe("createCoordinateFromIDNumber tests", () => {
        test("Ones digit only: 5 -> [5, 0]", () => {
            expect(createCoordinateFromIDNumber(5)).toEqual([5, 0]);
        });

        test("Tens digit only: 20 -> [0, 2]", () => {
            expect(createCoordinateFromIDNumber(20)).toEqual([0, 2]);
        });
        
        test("0: 0 -> [0, 0]", () => {
            expect(createCoordinateFromIDNumber(0)).toEqual([0, 0]);
        });

        test("Ones and tens digits: 52 -> [2, 5]", () => {
            expect(createCoordinateFromIDNumber(52)).toEqual([2, 5])
        });
    });

    describe("createIDNumberFromCoordinate tests", () => {
        test("[0, 0] -> 0", () => {
            expect(createIDNumberFromCoordinate([0, 0])).toBe(0);
        });

        test("[0, 5] -> 50", () => {
            expect(createIDNumberFromCoordinate([0, 5])).toBe(50);
        });

        test("[5, 0] -> 5", () => {
            expect(createIDNumberFromCoordinate([5, 0])).toBe(5);
        });

        test("[5, 2] -> 25", () => {
            expect(createIDNumberFromCoordinate([5, 2])).toBe(25);
        });
    });
});
