import React, { Component } from 'react';

import _ from 'lodash';
import QRCode from 'qrcode.react';
import './ViewInvite.css';

import { connect } from 'react-redux';
import { getInvite } from '../../actions/InvitesActions';
import { claimInvite } from '../../actions/PassActions';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {
  Card,
  CardActions,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card';

/**
 * Lets a guest see their invitation to an event. TODO wen need to do error 
 * handling with the pass reducer.
 */
class ViewInvite extends Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    this.props.getInvite(this.props.id);
  }

  renderQRCode = pass => {
    if (!_.isEmpty(pass)) {
      let actions = [
        <FlatButton label="Cancel" primary={true} onClick={this.handleClose} />
      ];
      return (
        <Dialog
          title="This is your pass to the event:"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <QRCode value={pass.id} size={256} />
        </Dialog>
      );
    }
    return <div />;
  };

  render() {
    let { invite, pass, user } = this.props;

    return (
      <div className="ViewInvite">
        <Card>
          <CardMedia
            overlay={
              <CardTitle
                title={_.get(invite, 'event.title', 'title').toUpperCase()}
              />
            }
          >
            <img
              src={_.get(invite, 'event.picture', 'placeholder')}
              alt="banner"
              className="banner"
            />
          </CardMedia>
          <CardText>{_.get(invite, 'event.desc', 'desc')}</CardText>
          <CardActions>
            <FlatButton
              label="Show Pass"
              onClick={_ => {
                this.handleOpen();
                this.props.claimInvite(invite, user);
              }}
            />
          </CardActions>
        </Card>
        {this.renderQRCode(pass)}
      </div>
    );
  }
}

//ensures that the pass we have for this screen is for the same event as the invite
const mapStateToProps = (state, ownProps) => {
  return {
    invite: state.invite,
    pass: state.pass,
    id: ownProps.match.params.id,
    user: state.auth.userObject
  };
};

export default connect(mapStateToProps, { getInvite, claimInvite })(ViewInvite);
