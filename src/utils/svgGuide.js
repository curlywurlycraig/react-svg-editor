import React from "react";

/**
 Assumes that the input command is always absolute.
 I only ever call this with commands generated with the makeAbsolute command used.
 */
export function generateGuideSvgSegment(command) {
    console.log('command is ', command);
    switch (command.code) {
        case 'M':
        case 'Z':
        case 'V':
        case 'H':
        case 'L':
            return <line x1={command.x0} y1={command.y0} x2={command.x} y2={command.y} stroke="black" />;
        case 'C':
            return <React.Fragment>
                <line x1={command.x0} y1={command.y0} x2={command.x1} y2={command.y1} stroke="grey" />
                <line x1={command.x1} y1={command.y1} x2={command.x2} y2={command.y2} stroke="grey" />
                <line x1={command.x2} y1={command.y2} x2={command.x} y2={command.y} stroke="grey" />
                <path d={`M${command.x0}, ${command.y0} C${command.x1}, ${command.y1}, ${command.x2}, ${command.y2}, ${command.x}, ${command.y}`} stroke="black" fill="none" />
                <circle cx={command.x1} cy={command.y1} strokeWidth="0" fill="red" r="4px" />
                <circle cx={command.x2} cy={command.y2} strokeWidth="0" fill="red" r="4px" />
            </React.Fragment>;
        case 'S':
            return <React.Fragment>
                <line x1={command.x0} y1={command.y0} x2={command.x2} y2={command.y2} stroke="grey" />
                <line x1={command.x2} y1={command.y2} x2={command.x} y2={command.y} stroke="grey" />
                <path d={`M${command.x0}, ${command.y0} S${command.x2}, ${command.y2}, ${command.x}, ${command.y}`} stroke="black" fill="none" />
                <circle cx={command.x2} cy={command.y2} strokeWidth="0" fill="red" r="4px" />
            </React.Fragment>;
        default:
            return null;
    }
}
