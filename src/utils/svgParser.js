export const findSvgPathStrings = (svgString) => {
    const dAttributeRegex = / d="([^"]+)"/g;

    const results = [];
    var matchResult;
    while (matchResult = dAttributeRegex.exec(svgString)) {
        results.push(matchResult);
    }

    return results;
}
