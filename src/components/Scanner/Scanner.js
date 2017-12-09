import React from 'react';
import QrReader from 'react-qr-reader';
import { checkInPass } from '../../actions/ScannerActions';

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

    //this.props.checkInPass('-L-wIDTlNrG-qDnML0Lj');
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
      this.props.checkInPass(data);
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

export default connect(state => state, { checkInPass })(Scanner);
