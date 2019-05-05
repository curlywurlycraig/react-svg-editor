import {
    parseSvg,
    parseViewBox,
    getTokenAtIndex,
    findTokenIndices,
    moveSvgCommandAttribute,
    splitIntoTokens
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
        "tokenRange": [35, 35]
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
        "tokenRange": [71, 71]
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

describe('parseViewBox', () => {
    it('should return the empty string when no viewbox is set on root svg element', () => {
        const input = `<svg><path d="M10,10" /></svg>`;

        expect(parseViewBox(input)).toEqual("");
    });

    it('should return the viewBox on the root svg element', () => {
        const input = `<svg viewBox="0 0 100 100"><path d="M10,10" /></svg>`;

        expect(parseViewBox(input)).toEqual("0 0 100 100");
    });
});

describe('findTokenIndices', () => {
    it('should return the index positions when called with a relative line string', () => {
        const input = 'l5.5,10.3';

        expect(findTokenIndices(input)).toEqual([0, 1, 5]);
    });

    it('should return the attributes when attributes separated by minus', () => {
        const input = 'l5.5-10.3';

        expect(findTokenIndices(input)).toEqual([0, 1, 4]);
    });

    it('should return the attributes when attributes separated by space', () => {
        const input = 'l5.5 10.3';

        expect(findTokenIndices(input)).toEqual([0, 1, 5]);
    });

    it('should return the attributes when attributes separated by many spaces', () => {
        const input = 'l5.5        10.3';

        expect(findTokenIndices(input)).toEqual([0, 1, 12]);
    });

    it('should return the attributes when attributes separated by comma, space, and minus', () => {
        const input = 'l5.5, -10.3';

        expect(findTokenIndices(input)).toEqual([0, 1, 6]);
    });
});

describe('moveSvgCommandAttribute', () => {
    it('should move the destination of a final l command', () => {
        const input = '<svg viewBox="0 0 50 50"><path d="M0,0 l10,10" /></svg>';
        const parsedSvg = parseSvg(input);
        const token = getTokenAtIndex(parsedSvg, 41);

        const result = moveSvgCommandAttribute(input, token, 'd', 5, 5);

        expect(result).toEqual('<svg viewBox="0 0 50 50"><path d="M0,0 l5.00,5.00" /></svg>');
    });

    it('should move negative when move command situations cursor to the left and top', () => {
        const input = '<svg viewBox="0 0 50 50"><path d="M10,10 l10,10" /></svg>';
        const parsedSvg = parseSvg(input);
        const token = getTokenAtIndex(parsedSvg, 41);

        const result = moveSvgCommandAttribute(input, token, 'd', 5, 5);

        expect(result).toEqual('<svg viewBox="0 0 50 50"><path d="M10,10 l-5.00,-5.00" /></svg>');
    });

    it('should move the destination of a final c command', () => {
        const input = '<svg viewBox="0 0 50 50"><path d="M10,10 c10,10,15,20,50,55" /></svg>';
        const parsedSvg = parseSvg(input);
        const token = getTokenAtIndex(parsedSvg, 54);

        const result = moveSvgCommandAttribute(input, token, 'd', 5, 6);

        expect(result).toEqual('<svg viewBox="0 0 50 50"><path d="M10,10 c10,10,15,20,-5.00,-4.00" /></svg>');
    });

    it('should move the second control point of a final c command', () => {
        const input = '<svg viewBox="0 0 50 50"><path d="M0,0 c0.577-0.839,1.8-3.96,1.8-3.96" /></svg>';
        const parsedSvg = parseSvg(input);
        const token = getTokenAtIndex(parsedSvg, 52);

        const result = moveSvgCommandAttribute(input, token, 'c2', 1.95, -3.9);

        expect(result).toEqual('<svg viewBox="0 0 50 50"><path d="M0,0 c0.577,-0.839,1.95,-3.90,1.8,-3.96" /></svg>');
    });

    it('should move the second control point y value of a final c command from negative to positive', () => {
        const input = '<svg viewBox="0 0 50 50"><path d="M0,0 c0.577-0.839,1.8-3.96,1.8-3.96" /></svg>';
        const parsedSvg = parseSvg(input);
        const token = getTokenAtIndex(parsedSvg, 52);

        const result = moveSvgCommandAttribute(input, token, 'c2', 1.95, 3.9);

        expect(result).toEqual('<svg viewBox="0 0 50 50"><path d="M0,0 c0.577,-0.839,1.95,3.90,1.8,-3.96" /></svg>');
    });

    it('should replace the minus sign with a comma when a value becomes positive', () => {
        const input = '<svg viewBox="0 0 50 50"><path d="M0,0 c0.577-0.839-1.80,3.96,1.8-3.96" /></svg>';
        const parsedSvg = parseSvg(input);
        const token = getTokenAtIndex(parsedSvg, 52);

        const result = moveSvgCommandAttribute(input, token, 'c2', 1.69, 3.96);

        expect(result).toEqual('<svg viewBox="0 0 50 50"><path d="M0,0 c0.577,-0.839,1.69,3.96,1.8,-3.96" /></svg>');
    });

    it('should not remove end quotes', () => {
        const input = '<svg viewBox="0 0 50 50"><path d="M100,350 c25,-50 50,25 80,0" fill="none" stroke="red" /></svg>';
        const parsedSvg = parseSvg(input);
        const token = getTokenAtIndex(parsedSvg, 47);

        const result = moveSvgCommandAttribute(input, token, 'c2', 1.69, 3.96);

        expect(result).toEqual('<svg viewBox="0 0 50 50"><path d="M100,350 c25,-50,-98.31,-346.04,80,0" fill="none" stroke="red" /></svg>');
    });
});

describe('splitIntoTokens', () => {
    it('should split with a variety of separators', () => {
        const input = 'c0.5-0.8,1.8-1.9, 2.4 8.1';

        const result = splitIntoTokens(input);

        expect(result).toEqual(['c', 0.5, -0.8, 1.8, -1.9, 2.4, 8.1]);
    });
});
