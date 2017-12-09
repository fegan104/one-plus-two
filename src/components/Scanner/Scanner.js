import React from 'react';
import './Scanner.css';
import QrReader from 'react-qr-reader';
//import Loader from '../Common/Loader';
import { checkInPass } from '../../actions/ScannerActions';
import { setHeader } from '../../actions/HeaderActions';

import { connect } from 'react-redux';

class Scanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastResult: null
    };
  }

  handleScan(data) {
    if (data && data !== this.state.lastResult) {
      this.setState({ lastResult: data });

      this.props.checkInPass(data);
    }
  }

  handleError(err) {
    console.error(err);
  }

  componentDidMount() {
    this.props.setHeader({
      pageTitle: 'Pass Scanner',
      headerTitle: 'Pass Scanner',
      backButton: `/event/${this.props.eventId}`
    });
  }

  render() {
    let { scanned } = this.props;

    let statusBar = 'Waiting to scan a QR code';
    let scannerClass = 'ScannerComponent';

    if (scanned.checkIn) {
      statusBar = `Checked-in user: ${scanned.user.displayName ||
        scanned.user.email ||
        'xxx'}`;
      scannerClass = 'ScannerComponent success';
    } else if (scanned.loading) {
      scannerClass = 'ScannerComponent loading';
    } else if (scanned.error) {
      statusBar = `${scanned.error}`;
      scannerClass = 'ScannerComponent failed';
    }

    return (
      <div className={scannerClass}>
        <p style={{ textAlign: 'center' }}>{statusBar}</p>
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan.bind(this)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  return {
    eventId,
    scanned: state.scanned
  };
};

export default connect(mapStateToProps, { checkInPass, setHeader })(Scanner);
