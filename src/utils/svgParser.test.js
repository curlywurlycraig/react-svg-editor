import { isIndexInPathD, getPathDAtIndex } from "./svgParser";

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

describe('getPathDAtIndex', () => {
    it('should return null when the index is not inside a d attribute value', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"></svg>`;
        const index = 2; // In svg node, but not path node
        const result = getPathDAtIndex(input, index);

        expect(result).toBe(null);
    });

    it('should return the d string when the index is in a d attribute value', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"></svg>`;
        const index = 15;
        const result = getPathDAtIndex(input, index);

        expect(result).toBe("M10,10 l10,10 l-10,0 Z");
    });

    it('should return the first of multiple d strings', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"> <path d="M5,5"></svg>`;
        const index = 15;
        const result = getPathDAtIndex(input, index);

        expect(result).toBe("M10,10 l10,10 l-10,0 Z");
    });

    it('should return the last of multiple d strings', () => {
        const input = `<svg><path d="M10,10 l10,10 l-10,0 Z"> <path d="M5,5"></svg>`;
        const index = 49;
        const result = getPathDAtIndex(input, index);

        expect(result).toBe("M5,5");
    });

});
