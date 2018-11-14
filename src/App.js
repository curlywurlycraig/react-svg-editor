import React, { Component } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/svg';
import 'brace/theme/solarized_dark';

import styles from './App.module.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      svgCode: "<svg></svg>",
      aceWidth: 1000,
      aceHeight: 600,
    }

    this.aceRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  onChangeSvgText = newText => {
    this.setState({
      svgCode: newText,
    });
  };

  updateWindowDimensions = () => {
  }

  render() {
    return (
      <div className={styles.container}>
        <AceEditor
          mode="svg"
          theme="solarized_dark"
          onChange={this.onChangeSvgText}
          width={`${this.state.aceWidth}px`}
          height={`${this.state.aceHeight}px`}
          value={this.state.svgCode}
          ref={this.aceRef}
        />

        <div
          id="svgContainer"
          dangerouslySetInnerHTML={{ __html: this.state.svgCode }}
        />
      </div>
    );
  }
}

export default App;
