import React, { Component } from 'react';

import QRCode from 'qrcode.react';
import './ViewInvite.css';

import { connect } from 'react-redux';
import { getInvite } from '../../actions/InvitesActions';
import { claimInvite } from '../../actions/PassActions';

import FlatButton from 'material-ui/FlatButton';
import {
  Card,
  CardActions,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card';

import _ from 'lodash';

/**
 * Lets a guest see their invitation to an event. If the invitation has already been 
 * redeemed for a pass then the pass will be displayed (TODO). Otherwise it will 
 * prompt the user to 'get a pass'.
 */
class ViewInvite extends Component {
  componentDidMount() {
    this.props.getInvite(this.props.id);
  }

  renderQRCode = pass => {
    if (!_.isEmpty(pass)) {
      return (
        <div>
          This is your pass to the event:
          <QRCode value={pass.id} size={256} />
        </div>
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
              onClick={_ => this.props.claimInvite(invite, user)}
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
    user: state.user
  };
};

export default connect(mapStateToProps, { getInvite, claimInvite })(ViewInvite);
