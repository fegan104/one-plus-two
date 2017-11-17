import React from 'react';
import QrReader from 'react-qr-reader';
import { claimPass } from '../../actions/ScannerActions';

import { connect } from 'react-redux';

class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 300,
      result: 'No result',
      lastResult: 'No result'
    };
    this.handleScan = this.handleScan.bind(this);
  }
  handleScan(data) {
    if (data && data !== this.state.lastResult) {
      this.setState(old => {
        return {
          ...old,
          lastResult: old.result,
          result: data
        };
      }, console.log(this.state));
      this.props.claimPass(data);
    }
  }
  handleError(err) {
    console.error(err);
  }
  render() {
    return (
      <div>
        <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: '100%' }}
        />
        <p>{this.state.result}</p>
      </div>
    );
  }
}

export default connect(state => state, { claimPass })(Scanner);
