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
      aceWidth: window.innerWidth,
      aceHeight: window.innerHeight,
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
    this.setState({
      aceWidth: window.innerWidth / 2.0,
      aceHeight: window.innerHeight,
    })
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
