export const parseCharacterRangeObject = (svgString) => {
    return parseCharacterRangeObjectAt(svgString, 0);
}

/**
 * Consider making this compliant with SVG specs, but that sounds like a huge task.
 *
 * @param {string} svgString
 * @param {*} startsAt
 */
const parseCharacterRangeObjectAt = (svgString, startsAt) => {
    const result = {
        startsAt,
        children: [],
        attributes: [],
    }

    var c = 0;
    if (svgString[c] != 'c') {
        return
    }


    for (var c = 0; c <= svgString.length; c++) {
    }



    // loop through characters until there is a space, that's the node name

    // loop until a '>', these are all the attributes
        // TODO Parse attributes
        // loop through characters until there is an equals sign and some quotes, that's an attribute name

        // loop through
    // end loop

    // children are here. Store this starts position

    // loop until </node name>. We're done. Store endsAt, and recurse on children

    // return result
}