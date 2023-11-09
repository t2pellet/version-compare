import {isInteger, numberCompare} from "../src/util";

describe('utility functions', () => {
    describe('isInteger', () => {
        test('integer', () => {
            expect(isInteger('37')).toBeTruthy();
        })

        test('float', () => {
            expect(isInteger('3.7')).toBeFalsy();
        })

        test('non numeric', () => {
            expect(isInteger('abc')).toBeFalsy();
        })
    })

    describe('numberCompare', () => {
        test('x1 < x2', () => {
            expect(numberCompare(1, 3)).toBe(-1);
        })

        test('x1 == x2', () => {
            expect(numberCompare(3, 3)).toBe(0);
        })

        test('x1 > x2', () => {
            expect(numberCompare(3, 1)).toBe(1);
        })
    })
})