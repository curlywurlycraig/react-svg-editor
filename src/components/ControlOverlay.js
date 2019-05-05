import React from 'react';
import PropTypes from 'prop-types';
import styles from './ControlOverlay.module.css';


const terminalFill = "#d8d8d8";
const terminalStroke = "#999999";
const controlFill = "#e09191";
const controlStroke = "#a36b6b";
const circleRadiusPx = 8;


const Attribute = {
    Origin: 'o',
    Destination: 'd',
    Control1: 'c1',
    Control2: 'c2'
}

class ControlOverlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentlyMovingAttribute: null, // 'd': destination
        };
    }

    onMouseMove = event => {
        if (!this.state.currentlyMovingAttribute) {
            return;
        }

        this.props.onMoveControlPoint(this.state.currentlyMovingAttribute, event.pageX, event.pageY);
    }

    /**
       Assumes that the input command is always absolute.
       I only ever call this with commands generated with the makeAbsolute command used.
     */
    generateGuideSvgSegment = () => {
        const command = this.props.token.absolute;

        const circleStrokeWidth = this.props.viewBoxScalingFactor * 1;
        const circleRadius = this.props.viewBoxScalingFactor * circleRadiusPx;

        switch (command.code) {
            case 'M':
            case 'Z':
            case 'V':
            case 'H':
            case 'L':
                return <React.Fragment>
                    <line
                        x1={command.x0}
                        y1={command.y0}
                        x2={command.x}
                        y2={command.y}
                        stroke="black"
                        strokeWidth={circleStrokeWidth}
                    />
                    <circle
                        className={styles.terminal_point}
                        cx={command.x0}
                        cy={command.y0}
                        strokeWidth={circleStrokeWidth}
                        stroke={terminalStroke}
                        fill={terminalFill}
                        r={circleRadius}
                        onMouseDown={() => this.setState({currentlyMovingAttribute: Attribute.Origin})}
                        onMouseUp={() => this.setState({currentlyMovingAttribute: null})}
                    />
                    <circle
                        className={styles.terminal_point}
                        cx={command.x}
                        cy={command.y}
                        fill={terminalFill}
                        r={circleRadius}
                        strokeWidth={circleStrokeWidth}
                        stroke={terminalStroke}
                        onMouseDown={() => this.setState({currentlyMovingAttribute: Attribute.Destination})}
                        onMouseUp={() => this.setState({currentlyMovingAttribute: null})}
                    />
                </React.Fragment>;
            case 'C':
                return <React.Fragment>
                    <line x1={command.x0}
                          y1={command.y0}
                          x2={command.x1}
                          y2={command.y1}
                          stroke="grey"
                          strokeWidth={circleStrokeWidth}
                    />
                    <line
                        x1={command.x1}
                        y1={command.y1}
                        x2={command.x2}
                        y2={command.y2}
                        stroke="grey"
                        strokeWidth={circleStrokeWidth}
                    />
                    <line
                        x1={command.x2}
                        y1={command.y2}
                        x2={command.x}
                        y2={command.y}
                        stroke="grey"
                        strokeWidth={circleStrokeWidth}
                    />
                    <path
                        d={`M${command.x0}, ${command.y0} C${command.x1}, ${command.y1}, ${command.x2}, ${command.y2}, ${command.x}, ${command.y}`}
                        stroke="black"
                        fill="none"
                        strokeWidth={circleStrokeWidth}
                    />
                    <circle
                        className={styles.terminal_point}
                        cx={command.x0}
                        cy={command.y0}
                        strokeWidth={circleStrokeWidth}
                        stroke={terminalStroke}
                        fill={terminalFill}
                        r={circleRadius}
                        onMouseDown={() => this.setState({currentlyMovingAttribute: Attribute.Origin})}
                        onMouseUp={() => this.setState({currentlyMovingAttribute: null})}
                    />
                    <circle
                        className={styles.terminal_point}
                        cx={command.x}
                        cy={command.y}
                        strokeWidth={circleStrokeWidth}
                        stroke={terminalStroke}
                        fill={terminalFill}
                        r={circleRadius}
                        onMouseDown={() => this.setState({currentlyMovingAttribute: Attribute.Destination})}
                        onMouseUp={() => this.setState({currentlyMovingAttribute: null})}
                    />
                    <circle
                        className={styles.control_point}
                        cx={command.x1}
                        cy={command.y1}
                        strokeWidth={circleStrokeWidth}
                        stroke={controlStroke}
                        fill={controlFill}
                        r={circleRadius}
                        onMouseDown={() => this.setState({currentlyMovingAttribute: Attribute.Control1})}
                        onMouseUp={() => this.setState({currentlyMovingAttribute: null})}
                    />
                    <circle
                        className={styles.control_point}
                        cx={command.x2}
                        cy={command.y2}
                        strokeWidth={circleStrokeWidth}
                        stroke={controlStroke}
                        fill={controlFill}
                        r={circleRadius}
                        onMouseDown={() => this.setState({currentlyMovingAttribute: Attribute.Control2})}
                        onMouseUp={() => this.setState({currentlyMovingAttribute: null})}
                    />
                </React.Fragment>;
            case 'S':
                return <React.Fragment>
                    <line
                        x1={command.x0}
                        y1={command.y0}
                        x2={command.x2}
                        y2={command.y2}
                        stroke="grey"
                        strokeWidth={circleStrokeWidth}
                    />
                    <line
                        x1={command.x2}
                        y1={command.y2}
                        x2={command.x}
                        y2={command.y}
                        stroke="grey"
                        strokeWidth={circleStrokeWidth}
                    />
                    <path
                        d={`M${command.x0}, ${command.y0} S${command.x2}, ${command.y2}, ${command.x}, ${command.y}`}
                        stroke="black"
                        fill="none"
                        strokeWidth={circleStrokeWidth}
                    />
                    <circle
                        className={styles.control_point}
                        cx={command.x2}
                        cy={command.y2}
                        strokeWidth={circleStrokeWidth}
                        stroke={controlStroke}
                        fill={controlFill}
                        r={circleRadius}
                        onMouseDown={() => this.setState({currentlyMovingAttribute: Attribute.Control1})}
                        onMouseUp={() => this.setState({currentlyMovingAttribute: null})}
                    />
                    <circle
                        className={styles.terminal_point}
                        cx={command.x0}
                        cy={command.y0}
                        strokeWidth={circleStrokeWidth}
                        stroke={terminalStroke}
                        fill={terminalFill}
                        r={circleRadius}
                        onMouseDown={() => this.setState({currentlyMovingAttribute: Attribute.Origin})}
                        onMouseUp={() => this.setState({currentlyMovingAttribute: null})}
                    />
                    <circle
                        className={styles.terminal_point}
                        cx={command.x}
                        cy={command.y}
                        strokeWidth={circleStrokeWidth}
                        stroke={terminalStroke}
                        fill={terminalFill}
                        r={circleRadius}
                        onMouseDown={() => this.setState({currentlyMovingAttribute: Attribute.Destination})}
                        onMouseUp={() => this.setState({currentlyMovingAttribute: null})}
                    />
                </React.Fragment>;
            default:
                return null;
        }
    }

    render() {
        if (!this.props.token) {
            return null;
        }

        const overlayContents = this.generateGuideSvgSegment();

        return <svg
            onMouseUp={() => this.setState({currentlyMovingAttribute: null})}
            onMouseMove={this.onMouseMove}
            viewBox={this.props.viewBox}>${overlayContents}
        </svg>;
    }
};

ControlOverlay.propTypes = {
    token: PropTypes.shape(),
    viewBox: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    onMoveControlPoint: PropTypes.func.isRequired
};

export default ControlOverlay;
