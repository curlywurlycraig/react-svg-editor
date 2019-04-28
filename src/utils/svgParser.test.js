import {
    parseSvg,
    getTokenAtIndex
} from "./svgParser";


describe('parseSvg', () => {
    it('should return an empty list when there are no paths', () => {
        const input = `<svg><circle /></svg>`;
        expect(parseSvg(input)).toEqual([]);
    });

    it('should return an entry there is a path', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"></svg>`;

        const expectedResult = [{
            "end": 36,
            "parsed": [{
                "code": "M",
                "command": "moveto",
                "tokenRange": [14, 20],
                "x": 10,
                "y": 10
            }, {
                "code": "l",
                "command": "lineto",
                "relative": true,
                "tokenRange": [21, 27],
                "x": 10,
                "y": 10
            }, {
                "code": "l",
                "command": "lineto",
                "relative": true,
                "tokenRange": [28, 34],
                "x": -10,
                "y": 0
            }, {
                "code": "Z",
                "command": "closepath",
                "tokenRange": [35, 36]
            }],
            "raw": "M10,10 l10,10 l-10,0 Z",
            "start": 14,
            "type": "d"
        }];

        expect(parseSvg(input)).toEqual(expectedResult);
    });

    it('should return two entries when there are two paths', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"><path d="M5,5 c10,10,10,10,10,10 Z"></svg>`;

        const expectedResult = [{
            "end": 36,
            "parsed": [{
                "code": "M",
                "command": "moveto",
                "tokenRange": [14, 20],
                "x": 10,
                "y": 10
            }, {
                "code": "l",
                "command": "lineto",
                "relative": true,
                "tokenRange": [21, 27],
                "x": 10,
                "y": 10
            }, {
                "code": "l",
                "command": "lineto",
                "relative": true,
                "tokenRange": [28, 34],
                "x": -10,
                "y": 0
            }, {
                "code": "Z",
                "command": "closepath",
                "tokenRange": [35, 36]
            }],
            "raw": "M10,10 l10,10 l-10,0 Z",
            "start": 14,
            "type": "d"
        }, {
            "end": 72,
            "parsed": [{
                "code": "M",
                "command": "moveto",
                "tokenRange": [47, 51],
                "x": 5,
                "y": 5
            }, {
                "code": "c",
                "command": "curveto",
                "relative": true,
                "tokenRange": [52, 70],
                "x": 10,
                "x1": 10,
                "x2": 10,
                "y": 10,
                "y1": 10,
                "y2": 10
            }, {
                "code": "Z",
                "command": "closepath",
                "tokenRange": [71, 72]
            }],
            "raw": "M5,5 c10,10,10,10,10,10 Z",
            "start": 47,
            "type": "d"
        }];

        expect(parseSvg(input)).toEqual(expectedResult);
    });
});

describe('getTokenAtIndex', () => {
    it('should return null when there is no parsed token at the given index', () => {
        const input = [{
            "end": 36,
            "parsed": [{
                "code": "M",
                "command": "moveto",
                "tokenRange": [10, 16],
                "x": 10,
                "y": 10
            }, {
                "code": "l",
                "command": "lineto",
                "relative": true,
                "tokenRange": [17, 23],
                "x": 10,
                "y": 10
            }, {
                "code": "l",
                "command": "lineto",
                "relative": true,
                "tokenRange": [24, 30],
                "x": -10,
                "y": 0
            }, {
                "code": "Z",
                "command": "closepath",
                "tokenRange": [31, 32]
            }],
            "raw": "M10,10 l10,10 l-10,0 Z",
            "start": 14,
            "type": "d"
        }];

        const result = getTokenAtIndex(input, 10);

        expect(result).toEqual(null);
    });

    it('should return the token object in which the given index lies', () => {
        const input = [{
            "end": 36,
            "parsed": [{
                "code": "M",
                "command": "moveto",
                "tokenRange": [10, 16],
                "x": 10,
                "y": 10
            }, {
                "code": "l",
                "command": "lineto",
                "relative": true,
                "tokenRange": [17, 23],
                "x": 10,
                "y": 10
            }, {
                "code": "l",
                "command": "lineto",
                "relative": true,
                "tokenRange": [24, 30],
                "x": -10,
                "y": 0
            }, {
                "code": "Z",
                "command": "closepath",
                "tokenRange": [31, 32]
            }],
            "raw": "M10,10 l10,10 l-10,0 Z",
            "start": 14,
            "type": "d"
        }];

        const result = getTokenAtIndex(input, 26);

        expect(result).toEqual({
            "code": "l",
            "command": "lineto",
            "relative": true,
            "tokenRange": [24, 30],
            "x": -10,
            "y": 0
        });
    });
});
