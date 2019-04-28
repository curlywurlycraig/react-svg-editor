import parsePath from "svg-path-parser";
import library from "js-svg-path";

export const isIndexInPathD = (svgString, index) => {
    const dAttributeRegex = / d="[^"]*$/g;
    const stringToIndex = svgString.substr(0, index);
    const match = dAttributeRegex.exec(stringToIndex);

    return match !== null;
};

export const getParsedPathAtIndex = (svgString, index) => {
    if (!isIndexInPathD(svgString, index)) {
        return null;
    }

    const firstPartRegex = / d="([^"]*)$/g;
    const firstPartFullString = svgString.substr(0, index);
    const firstPartMatch = firstPartRegex.exec(firstPartFullString);
    const firstPart = firstPartMatch[1];
    const matchIndex = firstPartMatch.index + " d=\"".length;

    const secondPartRegex = /([^"]*)"/g;
    const secondPartFullString = svgString.substr(index);
    const secondPart = secondPartRegex.exec(secondPartFullString)[1];

    const raw = firstPart + secondPart;

    const parsed = parsePath(raw);
    addTokenRangesToParsedPath(raw, parsed, matchIndex);
    return {
        raw,
        index: matchIndex,
        parsed: parsed
    };
};

function addTokenRangesToParsedPath(pathString, parsedPath, startIndex) {
    let stringIndex = 0;
    let isInToken = false;
    for (let i = 0; i < parsedPath.length; i++) {
        const tokenStartIndex = stringIndex;

        // end case
        if (i == parsedPath.length - 1) {
            parsedPath[i].tokenRange = [tokenStartIndex + startIndex, pathString.length + startIndex];
            return;
        }

        const nextToken = parsedPath[i+1];

        while (pathString[stringIndex] != nextToken.code || stringIndex == tokenStartIndex) {
            stringIndex++;
        }

        // At this point, stringIndex points to location of next token
        parsedPath[i].tokenRange = [tokenStartIndex + startIndex, stringIndex + startIndex - 1];
    }
}

