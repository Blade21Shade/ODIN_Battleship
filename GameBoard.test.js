import GameBoard from "./GameBoard.js"

describe("GameBoard tests", () => {
    let testBoard = new GameBoard(10);

    afterEach(()=> {
        testBoard.resetBoard();
    });

    describe("Ship placement tests", () => {
        test("Bounds check, valid: [2, 4], [2, 7] -> Placed", () => {
            testBoard.placeShip([2,4], [2,7]);
            expect(testBoard.getShipList().length).toBe(1);
        });

        describe("Error tests", () => {
            describe("Out of bounds", () => {
                // The checks for the start and end coords are the same, so just use start coords for the tests
                test("Start coord, below min X: [-1, 0], [4, 0]", () => {
                    expect(()=>{testBoard.placeShip([-1, 0], [4, 0])}).toThrow();
                });

                test("Start coord, above max X: [12, 0], [8, 0]", () => {
                    expect(()=>{testBoard.placeShip([12, 0], [8, 0])}).toThrow();
                });

                test("Start coord, below min Y: [0, -1], [0, 4]", () => {
                    expect(()=>{testBoard.placeShip([0, -1], [0, 4])}).toThrow();
                });

                test("Start coord, above max Y: [0, 12], [0, 8]", () => {
                    expect(()=>{testBoard.placeShip([0, 12], [0, 8])}).toThrow();
                });
            });

            test("Overlapping: [4,4][4,6] && [3,4][5,4]", () => {
                testBoard.placeShip([4,4], [4,6]);
                expect(()=>{testBoard.placeShip([3,4], [5,4])}).toThrow();
            });
        });
    });

    describe("Fire at board tests", () => {
        test("Hit", () => {
            testBoard.placeShip([3, 5], [3, 7]);
            expect(testBoard.fireAtBoard([3,6])).toBe(1);
        });

        test("Miss", () => {
            expect(testBoard.fireAtBoard([3,6])).toBe(-1);
        });

        describe("Error tests", () => {
            test("Position outside the board's bounds", () => {
                expect(()=>{testBoard.fireAtBoard([20,20])}).toThrow();
            });
            
            test("Fire at position already marked", () => {
                testBoard.fireAtBoard([3,6]);
                expect(()=>{testBoard.fireAtBoard([3,6])}).toThrow();
            }); 
        }); 
    });

    describe("Check if all ships are sunk", () => {
        describe("One ship", () => {
            test("All ships are sunk: return true", () => {
                testBoard.placeShip([0, 0],[0, 1]);
                testBoard.fireAtBoard([0,0]);
                testBoard.fireAtBoard([0,1]); // fireAtBoard calls checkIfAllShipsSunk(), so it should be true at this point
                expect(testBoard.checkIfAllShipsSunk()).toBe(true); // checkIfAllShipsSunk() can still be manually called
            });

            test("Not all ships are sunk: return false", () => {
                testBoard.placeShip([0, 0],[0, 1]);
                testBoard.fireAtBoard([0,0]);
                expect(testBoard.checkIfAllShipsSunk()).toBe(false);
            });
        });

        describe("Two ships", () => {
            test("All ships are sunk: return true", () => {
                testBoard.placeShip([0, 0],[0, 1]); // Ship 1
                testBoard.placeShip([5, 5],[5, 6]); // Ship 2
                testBoard.fireAtBoard([0,0]);
                testBoard.fireAtBoard([0,1]); // Ship 1 sunk
                testBoard.fireAtBoard([5,5]);
                testBoard.fireAtBoard([5,6]); // Ship 2 sunk
                expect(testBoard.checkIfAllShipsSunk()).toBe(true);
            });

            test("Not all ships are sunk: return false", () => {
                testBoard.placeShip([0, 0],[0, 1]); // Ship 1
                testBoard.placeShip([5, 5],[5, 6]); // Ship 2
                testBoard.fireAtBoard([0,0]);
                testBoard.fireAtBoard([0,1]); // Ship 1 sunk
                testBoard.fireAtBoard([5,5]); // Ship 2 still un-sunk
                expect(testBoard.checkIfAllShipsSunk()).toBe(false);
            });
        });
        
    });

});

