import React, {
    Component
} from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/svg';
import 'brace/theme/solarized_dark';

import styles from './App.module.css';
import InitialSvg from './constants/EngineComponentSvg';
// import InitialSvg from './constants/ReactLogoSvg';
// import InitialSvg from './constants/TinySvg';
import { parseSvg, parseViewBox, getTokenAtIndex, moveSvgCommandAttribute } from './utils/svgParser';
import ControlOverlay from './components/ControlOverlay';
import { getScalingFactor, getXOffset, getYOffset } from './utils/viewBox';

class App extends Component {
    constructor() {
        super();

        const viewBoxString = parseViewBox(InitialSvg);
        const paneWidth = window.innerWidth / 2.0;
        console.log('scroll y is ', window.scrollY);

        this.state = {
            svgCode: InitialSvg,
            parsedSvgCode: parseSvg(InitialSvg),
            viewBox: viewBoxString,
            paneWidth,
            viewBoxScalingFactor: getScalingFactor(viewBoxString, paneWidth),
            viewBoxXOffset: getXOffset(viewBoxString),
            viewBoxYOffset: getYOffset(viewBoxString),
            currentToken: null,
            error: null
        };

        this.aceRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = event => {
        const paneWidth = window.innerWidth / 2.0;

        this.setState({
            paneWidth,
            viewBoxScalingFactor: getScalingFactor(this.viewBox, paneWidth),
            viewBoxXOffset: getXOffset(this.viewBox),
            viewBoxYOffset: getYOffset(this.viewBox)
        });
    }

    buildMarkers = () => {
        if (!this.state.currentToken) {
            return [];
        }

        const [tokenStart, tokenEnd] = this.state.currentToken.token.tokenRange;
        const startPosition = this.aceRef.current.editor.session.doc.indexToPosition(tokenStart);
        const endPosition = this.aceRef.current.editor.session.doc.indexToPosition(tokenEnd);

        return [{
            startRow: startPosition.row,
            startCol: startPosition.column,
            endRow: endPosition.row,
            endCol: endPosition.column + 1,
            className: styles.editor__highlighted_token_marker,
            type: 'background'
        }];
    }

    onChangeSvgText = newText => {
        try {
            const newParsedSvg = parseSvg(newText);
            const token = getTokenAtIndex(newParsedSvg, this.state.currentCursorIndex);
            const newViewBox = parseViewBox(newText);

            this.setState({
                currentToken: token,
                svgCode: newText,
                parsedSvgCode: newParsedSvg,
                viewBox: newViewBox,
                error: null,
                viewBoxScalingFactor: getScalingFactor(this.state.viewBox, this.state.paneWidth),
                viewBoxXOffset: getXOffset(this.state.viewBox)
            });
        } catch (e) {
            this.setState({
                svgCode: newText,
                error: e
            })
        }
    };

    onCursorChange = (selection, event) => {
        const cursorPosition = selection.getCursor();
        const cursorIndex = this.aceRef.current.editor.session.doc.positionToIndex(cursorPosition);

        const token = this.state.error != null ? null : getTokenAtIndex(this.state.parsedSvgCode, cursorIndex);
        this.setState({
            currentToken: token,
            currentCursorIndex: cursorIndex,
        });
    }

    onMoveControlPoint = (attribute, screenX, screenY) => {
        const cursorX = this.state.viewBoxScalingFactor * (screenX - this.state.paneWidth) + this.state.viewBoxXOffset;
        const cursorY = this.state.viewBoxScalingFactor * screenY + this.state.viewBoxYOffset;

        const newSvgCode = moveSvgCommandAttribute(this.state.svgCode, this.state.currentToken, attribute, cursorX, cursorY);
        this.onChangeSvgText(newSvgCode);
    }

    maybeRenderError() {
        if (this.state.error == null) {
            return null;
        }

        return <div className={styles.error_container}>
            <p className={styles.error_explanation}>
                An error occurred. Interactive editing is disabled until the error is fixed.
            </p>

            <p className={styles.error_content_text}>
                { this.state.error.message || "Unable to parse SVG. Unknown error."}
            </p>
        </div>
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.editor_container}>
                    <AceEditor
                        mode="svg"
                        theme="solarized_dark"
                        markers={this.buildMarkers()}
                        onChange={this.onChangeSvgText}
                        onCursorChange={this.onCursorChange}
                        width={`${this.state.paneWidth}px`}
                        height={`${window.innerHeight}px`}
                        value={this.state.svgCode}
                        ref={this.aceRef}
                        wrapEnabled
                    />
                </div>

                <div className={styles.svg_container}>
                    <div
                        className={styles.svg_content_container}
                        dangerouslySetInnerHTML={{ __html: this.state.svgCode }}
                    />

                    <div className={styles.svg_overlay}>
                        <ControlOverlay
                            token={this.state.currentToken}
                            viewBox={this.state.viewBox}
                            viewBoxScalingFactor={this.state.viewBoxScalingFactor}
                            width={window.innerWidth / 2.0}
                            onMoveControlPoint={this.onMoveControlPoint}
                        />
                    </div>

                    { this.maybeRenderError() }
                </div>
            </div>
        );
    }
}

export default App;
