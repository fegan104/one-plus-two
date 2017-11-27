import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import QRCode from 'qrcode.react';

class ShowPassDialog extends Component {
  render() {
    let actions = [
      <FlatButton label="Cancel" primary={true} onClick={this.props.onClose} />
    ];

    return (
      <Dialog
        title="Show this at entrance"
        actions={actions}
        modal={false}
        open={this.props.show}
        onRequestClose={this.props.onClose}
      >
        <QRCode
          value={(this.props.pass && this.props.pass.id) || 'error'}
          size={256}
        />
      </Dialog>
    );
  }
}

ShowPassDialog.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  pass: PropTypes.object
};

export default ShowPassDialog;
