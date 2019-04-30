import React from "react";
import styles from "./svgGuide.module.css";

const terminalFill = "#d8d8d8";
const terminalStroke = "#999999";
const controlFill = "#e09191";
const controlStroke = "#a36b6b";

/**
 Assumes that the input command is always absolute.
 I only ever call this with commands generated with the makeAbsolute command used.
 */
export function generateGuideSvgSegment(command, scaleUI) {
    console.log('command is ', command);
    console.log('scale UI is s', scaleUI);
    const circleStrokeWidth = scaleUI * 1;
    const circleRadius = scaleUI * 15;

    switch (command.code) {
        case 'M':
        case 'Z':
        case 'V':
        case 'H':
        case 'L':
            return <React.Fragment>
                <line x1={command.x0} y1={command.y0} x2={command.x} y2={command.y} stroke="black" strokeWidth={circleStrokeWidth} />
                <circle className={styles.terminal_point} cx={command.x} cy={command.y} strokeWidth={circleStrokeWidth} stroke={terminalStroke} fill={terminalFill} r={circleRadius} />
                <circle className={styles.terminal_point} cx={command.x0} cy={command.y0} strokeWidth={circleStrokeWidth} stroke={terminalStroke} fill={terminalFill} r={circleRadius} />
            </React.Fragment>;
        case 'C':
            return <React.Fragment>
                <line x1={command.x0} y1={command.y0} x2={command.x1} y2={command.y1} stroke="grey" strokeWidth={circleStrokeWidth} />
                <line x1={command.x1} y1={command.y1} x2={command.x2} y2={command.y2} stroke="grey" strokeWidth={circleStrokeWidth} />
                <line x1={command.x2} y1={command.y2} x2={command.x} y2={command.y} stroke="grey" strokeWidth={circleStrokeWidth} />
                <path d={`M${command.x0}, ${command.y0} C${command.x1}, ${command.y1}, ${command.x2}, ${command.y2}, ${command.x}, ${command.y}`} stroke="black" fill="none" strokeWidth={circleStrokeWidth} />
                <circle className={styles.terminal_point} cx={command.x0} cy={command.y0} strokeWidth={circleStrokeWidth} stroke={terminalStroke} fill={terminalFill} r={circleRadius} />
                <circle className={styles.terminal_point} cx={command.x} cy={command.y} strokeWidth={circleStrokeWidth} stroke={terminalStroke} fill={terminalFill} r={circleRadius} />
                <circle className={styles.control_point} cx={command.x1} cy={command.y1} strokeWidth={circleStrokeWidth} stroke={controlStroke} fill={controlFill} r={circleRadius} />
                <circle className={styles.control_point} cx={command.x2} cy={command.y2} strokeWidth={circleStrokeWidth} stroke={controlStroke} fill={controlFill} r={circleRadius} />
            </React.Fragment>;
        case 'S':
            return <React.Fragment>
                <line x1={command.x0} y1={command.y0} x2={command.x2} y2={command.y2} stroke="grey" strokeWidth={circleStrokeWidth} />
                <line x1={command.x2} y1={command.y2} x2={command.x} y2={command.y} stroke="grey" strokeWidth={circleStrokeWidth} />
                <path d={`M${command.x0}, ${command.y0} S${command.x2}, ${command.y2}, ${command.x}, ${command.y}`} stroke="black" fill="none" strokeWidth={circleStrokeWidth} />
                <circle className={styles.control_point} cx={command.x2} cy={command.y2} strokeWidth={circleStrokeWidth} stroke={controlStroke} fill={controlFill} r={circleRadius} />
                <circle className={styles.terminal_point} cx={command.x0} cy={command.y0} strokeWidth={circleStrokeWidth} stroke={terminalStroke} fill={terminalFill} r={circleRadius} />
                <circle className={styles.terminal_point} cx={command.x} cy={command.y} strokeWidth={circleStrokeWidth} stroke={terminalStroke} fill={terminalFill} r={circleRadius} />
            </React.Fragment>;
        default:
            return null;
    }
}
