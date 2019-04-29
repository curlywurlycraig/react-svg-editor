import {parseSVG, makeAbsolute} from "svg-path-parser";


/**
 Determines the document position indices that represent the range for each parsed token.

 Edits in place.

 TODO Consider making this pure, rather than editing in place.
 */
function addTokenRangesToParsedPath(pathString, startIndex, parsedPath) {
    let stringIndex = 0;
    let isInToken = false;

    for (let i = 0; i < parsedPath.length; i++) {
        const tokenStartIndex = stringIndex;

        if (i == parsedPath.length - 1) {
            parsedPath[i].tokenRange = [tokenStartIndex + startIndex, pathString.length + startIndex];
            return;
        }

        const nextToken = parsedPath[i+1];

        // TODO: Either fix the casing problem (Z is cased wrong in the parsing
        // tool) or don't compare the desired token at all, just check if it's a
        // used path character and assume it's formatted right.
        while (pathString[stringIndex].toLowerCase() != nextToken.code.toLowerCase() || stringIndex == tokenStartIndex) {
            stringIndex++;

            if (stringIndex > pathString.length) {
                return;
            }
        }

        parsedPath[i].tokenRange = [tokenStartIndex + startIndex, stringIndex + startIndex - 1];

    }
}

export function parseSvg(svgString) {
    const pathStringRegex = / d="([^"]*)"/g;

    let match = pathStringRegex.exec(svgString);

    const results = [];
    while(match != null) {
        const raw = match[1];
        const parsed = parseSVG(raw);
        const absolute = makeAbsolute(JSON.parse(JSON.stringify(parsed))); // Hacky, but fine for this because no functions or dates are defined.
        const start = match.index + ' d="'.length;
        const end = start + raw.length;

        addTokenRangesToParsedPath(raw, start, parsed);

        results.push({
            type: 'd',
            start,
            end,
            raw,
            parsed,
            absolute
        });

        match = pathStringRegex.exec(svgString);
    }

    return results;
}

export function getTokenAtIndex(parsedSvg, index) {
    for (let i = 0; i < parsedSvg.length; i++) {
        const attribute = parsedSvg[i];
        if (index >= attribute.start && index <= attribute.end) {
            for (let j = 0; j < attribute.parsed.length; j++) {
                const token = attribute.parsed[j];
                const [tokenStart, tokenEnd] = token.tokenRange;

                if (index >= tokenStart && index <= tokenEnd) {
                    return {
                        token,
                        absolute: attribute.absolute[j]
                    };
                }
            }
        }
    }

    return null;
}
