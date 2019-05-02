export const getScalingFactor = (viewBoxString, width) => {
    const viewBoxWidth = parseInt(viewBoxString.split(' ')[2]);
    return viewBoxWidth / width;
};

export const getXOffset = viewBoxString => {
    return parseInt(viewBoxString.split(' ')[0]);
};

export const getYOffset = viewBoxString => {
    return parseInt(viewBoxString.split(' ')[1]);
};
