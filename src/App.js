import React, { Component } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/svg';
import 'brace/theme/solarized_dark';

import styles from './App.module.css';
import ReactLogo from './ReactLogo';

class App extends Component {
  constructor() {
    super();

    this.state = {
      svgCode: ReactLogo,
      aceWidth: window.innerWidth,
      aceHeight: window.innerHeight,
    }

    this.aceRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  onChangeSvgText = newText => {
    const parser = new DOMParser();
    const document = parser.parseFromString(newText, "image/svg+xml");
    console.log('doc is ', document);
    debugger;

    this.setState({
      svgCode: newText,
    });
  };

  updateWindowDimensions = () => {
    this.setState({
      aceWidth: window.innerWidth / 2.0,
      aceHeight: window.innerHeight,
    })
  }

  onMouseMove = () => {
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
