import { generateGuideSvgSegment } from './svgGuide';

describe('generateGuideSvgSegment', () => {
    it('should return line for move command', () => {
        const inputCommand = {
            "code": "M",
            "command": "moveto",
            "x": 20,
            "y": 30,
            "x0": 0,
            "y0": 0,
            "relative": false
        };

        const result = generateGuideSvgSegment(inputCommand);

        expect(result).toEqual(`<line x1="0" y1="0" x2="20" y2="30" stroke="black" />`);
    });

    it('should return control points for curve command', () => {
        const inputCommand = {
            "code": "C",
            "command": "curveto",
            "relative": false,
            "x1": 577.5,
            "y1": 150.5,
            "x2": 571.1,
            "y2": 99.89,
            "x": 542.9,
            "y": 83.69,
            "x0": 563.1,
            "y0": 214.1
        };

        const result = generateGuideSvgSegment(inputCommand);

        const expectedOutput = `
<line x1="563.1" y1="214.1" x2="542.9" y2="83.69" stroke="black" />
<line x1="563.1" y1="214.1" x2="577.5" y2="150.5" stroke="grey" />
<line x1="577.5" y1="150.5" x2="571.1" y2="99.89" stroke="grey" />
<line x1="571.1" y1="99.89" x2="542.9" y2="83.69" stroke="grey" />
<circle cx="577.5" cy="150.5" stroke-width="0" fill="red" r="4px" />
<circle cx="571.1" cy="99.89" stroke-width="0" fill="red" r="4px" />`;
        expect(result).toEqual(expectedOutput);
    });

    it('should return a line for vertical line command', () => {
        const inputCommand = {
            "code": "V",
            "command": "vertical lineto",
            "relative": false,
            "y": 100.3,
            "x0": 520.5,
            "y0": 78.1,
            "x": 520.5
        };

        const result = generateGuideSvgSegment(inputCommand);

        expect(result).toEqual(`<line x1="520.5" y1="78.1" x2="520.5" y2="100.3" stroke="black" />`);
    });
});
