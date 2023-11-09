import * as utils from '../src/util';
import * as partCompare from "../src/compare/part";
import versionCompare from "../src/compare";

const versionPartCompare = partCompare.versionPartCompare;


const mockIsInteger = jest.fn();
const mockNumberCompare = jest.fn();
const mockLocaleCompare = jest.fn();

describe('version comparison', () => {
    jest.spyOn(utils, 'isInteger').mockImplementation(mockIsInteger);
    jest.spyOn(utils, 'numberCompare').mockImplementation(mockNumberCompare);
    jest.spyOn(String.prototype, 'localeCompare').mockImplementation(mockLocaleCompare)

    afterEach(() => {
        mockIsInteger.mockReset();
        mockNumberCompare.mockReset();
        mockLocaleCompare.mockReset();
    })

    describe('version part', () => {
        test('invalid input', () => {
            expect(() => versionPartCompare('123.45', '123')).toThrow(TypeError);
        })

        test('two equal ints', () => {
            mockIsInteger.mockReturnValue(true);
            mockNumberCompare.mockReturnValue(0);
            expect(versionPartCompare('123', '123')).toBe(0);
            expect(mockLocaleCompare).not.toHaveBeenCalled();
        })

        test('first int smaller', () => {
            mockIsInteger.mockReturnValue(true);
            mockNumberCompare.mockReturnValue(-1);
            expect(versionPartCompare('12', '456')).toBe(-1);
            expect(mockLocaleCompare).not.toHaveBeenCalled();
        })

        test('second int smaller', () => {
            mockIsInteger.mockReturnValue(true);
            mockNumberCompare.mockReturnValue(1);
            expect(versionPartCompare('456', '123')).toBe(1);
            expect(mockLocaleCompare).not.toHaveBeenCalled();
        })

        test('first int second not', () => {
            mockIsInteger.mockReturnValueOnce(true);
            mockIsInteger.mockReturnValueOnce(false);
            expect(versionPartCompare('123', 'abc')).toBe(-1);
            expect(mockNumberCompare).not.toHaveBeenCalled();
        })

        test('second int first not', () => {
            mockIsInteger.mockReturnValueOnce(false);
            mockIsInteger.mockReturnValueOnce(true);
            expect(versionPartCompare('abc', '123')).toBe(1);
            expect(mockNumberCompare).not.toHaveBeenCalled();
        })

        test('two non ints first greater', () => {
            mockIsInteger.mockReturnValue(false);
            mockLocaleCompare.mockReturnValue(1);
            expect(versionPartCompare('def', 'abc')).toBe(1);
            expect(mockNumberCompare).not.toHaveBeenCalled();
        })

        test('two non ints second greater', () => {
            mockIsInteger.mockReturnValue(false);
            mockLocaleCompare.mockReturnValue(-1);
            expect(versionPartCompare('abc', 'def')).toBe(-1);
            expect(mockNumberCompare).not.toHaveBeenCalled();
        })
    })

    describe('version full', () => {
        const mockVersionPartCompare = jest.fn();
        jest.spyOn(partCompare, 'versionPartCompare').mockImplementation(mockVersionPartCompare);

        afterEach(() => {
            mockVersionPartCompare.mockReset();
        })

        test('invalid input', () => {
            expect(() => versionCompare('?.#', '^^#')).toThrow(TypeError);
        })

        describe('same length', () => {
            test('base equal', () => {
                mockIsInteger.mockReturnValue(true);
                expect(versionCompare('123', '123')).toEqual(0);
            })

            test('base lt', () => {
                mockIsInteger.mockReturnValue(true);
                mockVersionPartCompare.mockReturnValue(-1);
                expect(versionCompare('121', '123')).toEqual(-1);
            })

            test('base gt', () => {
                mockIsInteger.mockReturnValue(true);
                mockVersionPartCompare.mockReturnValue(1);
                expect(versionCompare('127', '13')).toEqual(1);
            })

            test('multipart equal', () => {
                mockIsInteger.mockReturnValue(true);
                mockVersionPartCompare.mockReturnValue(0);
                expect(versionCompare('12.45.78.90', '12.45.78.90')).toBe(0);
            })

            test('multipart lt', () => {
                mockIsInteger.mockReturnValue(true);
                mockVersionPartCompare.mockReturnValueOnce(0).mockReturnValueOnce(-1);
                expect(versionCompare('12.56.78', '12.45.78')).toBe(-1);
            })

            test('multipart gt', () => {
                mockIsInteger.mockReturnValue(true);
                mockVersionPartCompare.mockReturnValueOnce(0).mockReturnValueOnce(1);
                expect(versionCompare('12.45.78', '12.56.78')).toBe(1);
            })
        })

        describe('mismatched length', () => {
            test('first has extra zeroes', () => {
                mockIsInteger.mockReturnValue(true);
                mockVersionPartCompare.mockReturnValue(0);
                expect(versionCompare('12.45.78.000.0.00.0', '12.45.78')).toBe(0);
                expect(mockVersionPartCompare).toHaveBeenCalledTimes(3);
            })

            test('second has extra zeroes', () => {
                mockIsInteger.mockReturnValue(true);
                mockVersionPartCompare.mockReturnValue(0);
                expect(versionCompare('12.45.78.0', '12.45.78.000.0.00.0')).toBe(0);
                expect(mockVersionPartCompare).toHaveBeenCalledTimes(4);
            })

            test('first has extra int', () => {
                mockIsInteger.mockReturnValue(true);
                mockVersionPartCompare.mockReturnValue(0);
                expect(versionCompare('12.45.78.000.0.01.0', '12.45.78')).toBe(1);
                expect(mockVersionPartCompare).toHaveBeenCalledTimes(3);
            })

            test('second has extra int', () => {
                mockIsInteger.mockReturnValue(true);
                mockVersionPartCompare.mockReturnValue(0);
                expect(versionCompare('12.45.78.0', '12.45.78.000.0.0.12')).toBe(-1);
                expect(mockVersionPartCompare).toHaveBeenCalledTimes(4);
            })

            test('first has extra non-int', () => {
                mockIsInteger.mockReturnValue(true);
                mockVersionPartCompare.mockReturnValue(0);
                expect(versionCompare('12.45.78.000.0.a.0', '12.45.78')).toBe(1);
                expect(mockVersionPartCompare).toHaveBeenCalledTimes(3);
            })

            test('second has extra non-int', () => {
                mockIsInteger.mockReturnValue(true);
                mockVersionPartCompare.mockReturnValue(0);
                expect(versionCompare('12.45.78.0', '12.45.78.000.0.0.b2a')).toBe(-1);
                expect(mockVersionPartCompare).toHaveBeenCalledTimes(4);
            })
        })
    })
})