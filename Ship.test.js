import Ship from "./Ship";

describe("Ship tests", ()=> {
    describe("Creating ships", ()=> {
        describe("Pass tests", ()=> {
            test("Horizontal, starts higher than end: [0,5], [0,2] -> [ [0,5], [0,4], [0,3], [0,2] ]", () => {
                let ship = new Ship([0,5], [0,2]);
                expect(ship.getCoordinateList()).toEqual([[0,5], [0,4], [0,3], [0,2]]);
            });

            test("Horizontal, starts lower than end: [0,2], [0,5] -> [ [0,2], [0,3], [0,4], [0,5] ]", () => {
                let ship = new Ship([0,2], [0,5]);
                expect(ship.getCoordinateList()).toEqual([[0,2], [0,3], [0,4], [0,5]]);
            });

            test("Vertical, starts higher than end: [5,0], [2,0] -> [ [5,0], [4,0], [3,0], [2,0] ]", () => {
                let ship = new Ship([5,0], [2,0]);
                expect(ship.getCoordinateList()).toEqual([[5,0], [4,0], [3,0], [2,0]]);
            });

            test("Vertical, starts lower than end: [2,0], [5,0] -> [ [2,0], [3,0], [4,0], [5,0] ]", () => {
                let ship = new Ship([2,0], [5,0]);
                expect(ship.getCoordinateList()).toEqual([[2,0], [3,0], [4,0], [5,0]]);
            });
        });

        describe("Error tests", ()=>{
            test("Neither axis match: [1,2], [3,4] -> Error", ()=> {
                expect(()=>{let ship = new Ship([1,2], [3,4])}).toThrow();
            });
        });
    });

    describe("Hitting ships", () => {
        let ship = new Ship([2, 4], [2, 6]);
        
        test("Successful hit", () => {
            expect(ship.hitCheck([2, 5])).toBe(true);
            expect(ship.getNumberOfHits()).toBe(1);
        });

        test("Miss", () => {
            expect(ship.hitCheck([2, 7])).toBe(false);
            expect(ship.getNumberOfHits()).toBe(1); // Hit from previous test is still there, this doesn't add a new one
        });

        test("Successful hits lead to sunk status", () => {
            ship.hitCheck([2,4]);
            ship.hitCheck([2,6]);
            expect(ship.getIsSunk()).toBe(true);
        });
    });
});