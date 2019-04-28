import {
    isIndexInPathD,
    getParsedPathAtIndex
} from "./svgParser";

describe('isIndexInPathD', () => {
    it('should return false when not in path node', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"></svg>`;
        const index = 2; // In svg node, but not path node
        const result = isIndexInPathD(input, index);

        expect(result).toBe(false);
    });

    it('should return false when in path node and d attribute name but not in value', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"></svg>`;
        const index = 11; // In d attribute
        const result = isIndexInPathD(input, index);

        expect(result).toBe(false);
    });

    it('should return true when in path node and d attribute value', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"></svg>`;
        const index = 15; // In d attribute
        const result = isIndexInPathD(input, index);

        expect(result).toBe(true);
    });
});

describe('getParsedPathAtIndex', () => {
    it('should return null when the index is not inside a d attribute value', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"></svg>`;
        const index = 2; // In svg node, but not path node
        const result = getParsedPathAtIndex(input, index);

        expect(result).toBe(null);
    });

    it('should return the d string when the index is in a d attribute value', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"></svg>`;
        const index = 15;
        const result = getParsedPathAtIndex(input, index);

        expect(result['raw']).toEqual("M10,10 l10,10 l-10,0 Z");
        expect(result['index']).toEqual(14);
    });

    it('should return the first of multiple d strings', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"> <path d="M5,5"></svg>`;
        const index = 15;
        const result = getParsedPathAtIndex(input, index);

        expect(result['raw']).toEqual("M10,10 l10,10 l-10,0 Z");
        expect(result['index']).toEqual(14);
    });

    it('should return the last of multiple d strings', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"> <path d="M5,5"></svg>`;
        const index = 49;
        const result = getParsedPathAtIndex(input, index);

        expect(result['raw']).toEqual("M5,5");
        expect(result['index']).toEqual(48);
    });

    it('should return the correct string when at the leftmost edge', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"> <path d="M5,5"></svg>`;
        const index = 14;
        const result = getParsedPathAtIndex(input, index);

        expect(result['raw']).toEqual("M10,10 l10,10 l-10,0 Z");
    });

    it('should return the correct string when at the rightmost edge', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"> <path d="M5,5"></svg>`;
        const index = 36;
        const result = getParsedPathAtIndex(input, index);

        expect(result['raw']).toEqual("M10,10 l10,10 l-10,0 Z");
    });

    it('should return the d string when split across multiple lines', () => {
        const input = `<svg>
<path d="M10,10 l10,10
l-10,0 Z"> <path d="M5,5"></svg>`;

        const index = 15;
        const result = getParsedPathAtIndex(input, index);

        expect(result['raw']).toEqual("M10,10 l10,10\nl-10,0 Z");
    });

    it('should include the parsed d string', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"> <path d="M5,5"></svg>`;
        const index = 14;
        const result = getParsedPathAtIndex(input, index);

        const expectedResult = [{
            "code": "M",
            "command": "moveto",
            "x": 10,
            "y": 10,
            "tokenRange": [14, 20]
        }, {
            "code": "l",
            "command": "lineto",
            "relative": true,
            "x": 10,
            "y": 10,
            "tokenRange": [21, 27]
        }, {
            "code": "l",
            "command": "lineto",
            "relative": true,
            "x": -10,
            "y": 0,
            "tokenRange": [28, 34]
        }, {
            "code": "Z",
            "command": "closepath",
            "tokenRange": [35, 36]
        }];

        expect(result['parsed']).toEqual(expectedResult);
    });
});
