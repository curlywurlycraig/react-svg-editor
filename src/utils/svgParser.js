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

export function parseViewBox(svgString) {
    const regex = /viewBox="([^"]*)"/g;
    const match = regex.exec(svgString);
    return match ? match[1] : "";
}

/**
 Rudimentary parsing of a path command. Simply splits the tokens into a list of token positions.
 This does not check that the correct number of arguments are supplied to the command.
 Assumes the command is well formed.

 Example: l10,5 will result in [0, 1, 4].

 See test suite for more examples.
 */
export function findTokenIndices(commandString) {
    const result = [0];

    let tokenStringSoFar = commandString[1];
    let withinToken = false;

    for (let i = 1; i < commandString.length; i++) {
        if (!withinToken && !', '.includes(commandString[i])) {
            result.push(i);
            withinToken = true;
        } else if (withinToken && ', '.includes(commandString[i])) {
            withinToken = false;
        } else if (withinToken && commandString[i] === '-') {
            result.push(i);
        }
    }

    return result;
}

export function splitIntoTokens(commandString) {
    const result = [commandString[0]];
    const withoutCommandName = commandString.slice(1);

    const tokenRegex = /[, ]*(-?[^-, $]+)(!?[0-9.])*/g;

    let match = tokenRegex.exec(withoutCommandName);

    while(match != null) {
        result.push(parseFloat(match[1]));

        match = tokenRegex.exec(withoutCommandName);
    }

    return result;
}

const attributeMap = {
    l: {
        d: 1
    },
    c: {
        c1: 1,
        c2: 3,
        d: 5
    },
    s: {
        c1: 1,
        d: 3
    },
    C: {
        c1: 1,
        c2: 3,
        d: 5
    }
};

/**
 cursorX and cursorY are in SVG units.
 */
export function moveSvgCommandAttribute(svgString, parsedToken, attribute, cursorX, cursorY) {
    const newX = parsedToken.token.relative ? cursorX - parsedToken.absolute.x0 : cursorX;
    const newY = parsedToken.token.relative ? cursorY - parsedToken.absolute.y0 : cursorY;

    let attributeSuffix = "";
    if (attribute.length > 1) {
        attributeSuffix = attribute[1];
    }

    const [tokenStart, tokenEnd] = parsedToken.token.tokenRange;

    const commandString = svgString.slice(tokenStart, tokenEnd + 1);
    const tokens = splitIntoTokens(commandString);

    // update the important tokens
    const xIndex = attributeMap[parsedToken.token.code][attribute];
    const yIndex = attributeMap[parsedToken.token.code][attribute] + 1;
    tokens[xIndex] = newX.toFixed(2); // TODO Don't do this
    tokens[yIndex] = newY.toFixed(2);

    const newCommandString = tokens[0] + tokens.slice(1).join(',');

    return svgString.slice(0, tokenStart) + newCommandString + svgString.slice(tokenEnd + 1);
}
