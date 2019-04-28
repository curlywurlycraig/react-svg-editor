import React, {
    Component
} from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/svg';
import 'brace/theme/solarized_dark';

import styles from './App.module.css';
import ReactLogo from './ReactLogo';
import * as utils from './utils/svgParser';

class App extends Component {
    constructor() {
        super();

        this.state = {
            svgCode: ReactLogo,
            aceWidth: window.innerWidth,
            aceHeight: window.innerHeight
        };

        this.aceRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
        // window.addEventListener('onmousemove', this.onMouseMove);
    }

    componentWillUnmount() {
        // window.removeEventListener('onmousemove', this.onMouseMove);
    }

    updateWindowDimensions = () => {
        this.setState({
            aceWidth: window.innerWidth / 2.0,
            aceHeight: window.innerHeight
        });
    }

    onChangeSvgText = newText => {
        this.setState({
            svgCode: newText
        });
    };

    onCursorChange = (selection, event) => {
        const cursorPosition = selection.getCursor();
        const cursorIndex = this.aceRef.current.editor.session.doc.positionToIndex(cursorPosition);

        console.log('d is: ', utils.getPathDAtIndex(this.state.svgCode, cursorIndex));
    }

    onMouseMove = event => {
        //console.log('move event ', event);
        // Translate mouse position to position on ace canvas

        // Translate position on ace canvas to character position

        // compare character position with parsed text and see which element it's in.
    }

    render() {
        return (
            <div className={styles.container}>
                <AceEditor
                    mode="svg"
                    theme="solarized_dark"
                    onChange={this.onChangeSvgText}
                    onCursorChange={this.onCursorChange}
                    width={`${window.innerWidth / 2.0}px`}
                    height={`${window.innerHeight}px`}
                    value={this.state.svgCode}
                    ref={this.aceRef}
                    wrapEnabled
                />

                <div
                    className={styles.svgContainer}
                    dangerouslySetInnerHTML={{ __html: this.state.svgCode }}
                />
            </div>
        );
    }
}

export default App;
