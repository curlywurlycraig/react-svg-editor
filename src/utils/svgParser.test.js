import {
    parseSvg,
    getTokenAtIndex
} from "./svgParser";


const firstExpectedParse = {
    "end": 36,
    "absolute": [{
        "code": "M",
        "command": "moveto",
        "relative": false,
        "x": 10,
        "x0": 0,
        "y": 10,
        "y0": 0
    },
    {
        "code": "L",
        "command": "lineto",
        "relative": false,
        "x": 20,
        "x0": 10,
        "y": 20,
        "y0": 10
    },
    {
        "code": "L",
        "command": "lineto",
        "relative": false,
        "x": 10,
        "x0": 20,
        "y": 20,
        "y0": 20
    },
    {
        "code": "Z",
        "command": "closepath",
        "relative": false,
        "x": 10,
        "x0": 10,
        "y": 10,
        "y0": 20
    }],
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
};

const secondExpectedParse = {
    "end": 72,
    "absolute": [{
        "code": "M",
        "command": "moveto",
        "relative": false,
        "x": 5,
        "x0": 0,
        "y": 5,
        "y0": 0
    },
    {
        "code": "C",
        "command": "curveto",
        "relative": false,
        "x": 15,
        "x0": 5,
        "x1": 15,
        "x2": 15,
        "y": 15,
        "y0": 5,
        "y1": 15,
        "y2": 15
    },
    {
        "code": "Z",
        "command": "closepath",
        "relative": false,
        "x": 5,
        "x0": 15,
        "y": 5,
        "y0": 15
    }],
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
};


describe('parseSvg', () => {
    it('should return an empty list when there are no paths', () => {
        const input = `<svg><circle /></svg>`;
        expect(parseSvg(input)).toEqual([]);
    });

    it('should return an entry when there is a path', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"></svg>`;

        const expectedResult = [firstExpectedParse];

        expect(parseSvg(input)).toEqual(expectedResult);
    });

    it('should return two entries when there are two paths', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"><path d="M5,5 c10,10,10,10,10,10 Z"></svg>`;

        const expectedResult = [firstExpectedParse, secondExpectedParse];

        expect(parseSvg(input)).toEqual(expectedResult);
    });
});

describe('getTokenAtIndex', () => {
    it('should return null when there is no parsed token at the given index', () => {
        const result = getTokenAtIndex([firstExpectedParse], 10);

        expect(result).toEqual(null);
    });

    it('should return the token object in which the given index lies', () => {
        const result = getTokenAtIndex([firstExpectedParse], 15);

        expect(result).toEqual({
            token: {
                "code": "M",
                "command": "moveto",
                "tokenRange": [14, 20],
                "x": 10,
                "y": 10
            },
            absolute: {
                "code": "M",
                "command": "moveto",
                "relative": false,
                "x": 10,
                "x0": 0,
                "y": 10,
                "y0": 0
            }
        });
    });

    it('should return the token object when the index is on the edge', () => {
        const result = getTokenAtIndex([firstExpectedParse], 20);


        expect(result).toEqual({
            token: {
                "code": "M",
                "command": "moveto",
                "tokenRange": [14, 20],
                "x": 10,
                "y": 10
            },
            absolute: {
                "code": "M",
                "command": "moveto",
                "relative": false,
                "x": 10,
                "x0": 0,
                "y": 10,
                "y0": 0
            }
        });
    });
});
