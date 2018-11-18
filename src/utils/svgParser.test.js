import { parseCharacterRangeObject } from "./svgParser";

describe('parseCharacterRangeObject', () => {
    it('should parse single element svg', () => {
        const svgString = `<svg></svg>`;

        const result = parseCharacterRangeObject(svgString);

        expect(result).toEqual({
            children: [{
                node: 'svg',
                startsAt: 0,
                endsAt: 10,
                attributes: [],
                children: [],
            }],
        });
    })

    it('should store the character range of the whole svg', () => {
        const svgString =
`<svg>
    <path d="M10,10" />
</svg>`;

        console.log(svgString.length);

        const result = parseCharacterRangeObject(svgString);

        expect(result).toEqual({
            children: [{
                node: 'svg',
                startsAt: 0,
                endsAt: 36,
                attributes: [],
                children: [{
                    node: 'path',
                    startsAt: 9,
                    endsAt: 27,
                    attributes: [{
                        name: 'd',
                        value: 'M10,10',
                        startsAt: 18,
                        endsAt: 23,
                    }],
                }],
            }],
        });
    })
})