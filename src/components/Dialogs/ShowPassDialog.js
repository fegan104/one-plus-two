import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import QRCode from 'qrcode.react';

class ShowPassDialog extends Component {
  render() {
    let actions = [
      <FlatButton label="Close" primary={true} onClick={this.props.onClose} />
    ];

    let { pass } = this.props;

    return (
      <Dialog
        title="Show at entrance"
        actions={actions}
        modal={false}
        open={this.props.show}
        onRequestClose={this.props.onClose}
      >
        <QRCode
          value={(pass && pass.id) || 'error'}
          size={200}
          fgColor={pass && pass.isUsed ? 'gray' : 'black'}
        />
        {pass && pass.isUsed ? <div>This pass has been used.</div> : null}
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
