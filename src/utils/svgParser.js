export const isIndexInPathD = (svgString, index) => {
    const dAttributeRegex = / d="[^"]+$/g;
    const stringToIndex = svgString.substr(0, index);
    const match = dAttributeRegex.exec(stringToIndex);

    return match !== null;
};

export const getPathDAtIndex = (svgString, index) => {
    if (!isIndexInPathD(svgString, index)) {
        return null;
    }

    const firstPartRegex = / d="([^"]+)$/g;
    const firstPartFullString = svgString.substr(0, index);
    const firstPart = firstPartRegex.exec(firstPartFullString)[1];

    const secondPartRegex = /([^"]+)"/g;
    const secondPartFullString = svgString.substr(index);
    const secondPart = secondPartRegex.exec(secondPartFullString)[1];

    return firstPart + secondPart;
};
