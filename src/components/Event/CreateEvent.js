import React, { Component } from 'react';
import './CreateEvent.css';

import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import Fab from 'material-ui/FloatingActionButton';
import DoneIcon from 'material-ui/svg-icons/action/done';
import { List, ListItem } from 'material-ui/List';
import Title from 'material-ui/svg-icons/editor/title';
import Subject from 'material-ui/svg-icons/action/subject';
import Location from 'material-ui/svg-icons/communication/location-on';
import People from 'material-ui/svg-icons/social/people';
import Today from 'material-ui/svg-icons/action/today';
import Time from 'material-ui/svg-icons/device/access-time';
import ImportContacts from 'material-ui/svg-icons/communication/import-export';
import PlusOne from 'material-ui/svg-icons/social/plus-one';
import InsertPhoto from 'material-ui/svg-icons/editor/insert-photo';
import RaisedButton from 'material-ui/RaisedButton';
import Loader from '../Common/Loader';

import { connect } from 'react-redux';
import {
  addEvent,
  uploadBanner,
  loadEvents
} from '../../actions/EventsActions';
import { setHeader } from '../../actions/HeaderActions';

import EventModel from '../../models/EventModel';

const NONE = 'None';

class CreateEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      importFrom: NONE
    };
  }

  handleTextChange = (field, event) => {
    let delta = {};
    delta[field] = event.target.value;

    this.setState(delta);
  };

  handleDateChange = (event, date) => {
    this.setState({
      date: date
    });
  };

  handleTimeChange = (event, time) => {
    this.setState({
      time: time
    });
  };

  handleMenuChange = (event, index, value) => {
    this.setState({ importFrom: value });
  };

  handleFileUpload = event => {
    const file = event.target.files[0];
    this.props.uploadBanner(file);
    this.setState({ uploadStarted: true });
  };

  handleCreateEvent = () => {
    let { user, addEvent, uploadUrl } = this.props;
    const guestLimit = parseInt(this.state.guestLimit);

    let owners = {};
    owners[user.id] = true;

    let selectedTime = new Date(this.state.time);
    let dateTime = new Date(this.state.date);
    dateTime.setHours(selectedTime.getHours());
    dateTime.setMinutes(selectedTime.getMinutes());

    let importFrom = this.state.importFrom;
    if (importFrom === NONE) {
      importFrom = null;
    }

    addEvent(
      EventModel({
        ...this.state,
        picture: uploadUrl,
        guestLimit: guestLimit,
        spotsLeft: guestLimit,
        dateTime: dateTime.toUTCString(),
        owners,
        importFrom,
        isSelfEnrollable: false
      })
    );
  };

  componentDidMount() {
    this.configureAppHeader();
    if (this.props.user && this.props.user.events) {
      this.props.loadEvents(Object.keys(this.props.user.events));
    }
  }

  configureAppHeader = () => {
    this.props.setHeader({
      pageTitle: 'Creating a New Event',
      headerTitle: 'New Event',
      backButton: '/'
    });
  };

  componentWillReceiveProps(newProps) {
    if (newProps.uploadUrl) {
      this.setState({ uploadStarted: false });
    }
    let user = newProps.user;
    let userId = user && user.id;

    if (
      userId &&
      user.events &&
      !(this.props.user && this.props.user.events === user.events)
    ) {
      this.props.loadEvents(Object.keys(user.events));
    }
  }

  renderUpload = () => {
    if (this.props.uploadUrl) {
      return <div>Image uploaded successfully!</div>;
    } else if (this.state.uploadStarted) {
      return <Loader />;
    } else {
      return (
        <RaisedButton
          label="Upload a banner"
          labelPosition="before"
          primary={true}
          containerElement="label"
        >
          <input
            type="file"
            onChange={this.handleFileUpload}
            style={{
              cursor: 'pointer',
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              width: '100%',
              opacity: 0
            }}
          />
        </RaisedButton>
      );
    }
  };

  render() {
    return (
      <div>
        <List className="CreateEvent-list">
          <ListItem leftIcon={<Title />}>
            <TextField
              floatingLabelText="Event Title"
              fullWidth={true}
              value={this.state.title || ''}
              onChange={this.handleTextChange.bind(null, 'title')}
            />
          </ListItem>

          <ListItem leftIcon={<Subject />}>
            <TextField
              style={{ textAlign: 'left' }}
              floatingLabelText="Description"
              fullWidth={true}
              multiLine={true}
              rows={2}
              value={this.state.desc}
              onChange={this.handleTextChange.bind(null, 'desc')}
            />
          </ListItem>

          <ListItem leftIcon={<Location />}>
            <TextField
              fullWidth={true}
              floatingLabelText="Location"
              value={this.state.location || ''}
              onChange={this.handleTextChange.bind(null, 'location')}
            />
          </ListItem>

          <ListItem leftIcon={<People />}>
            <TextField
              floatingLabelText="Max guests"
              fullWidth={true}
              type="number"
              value={this.state.guestLimit || ''}
              onChange={this.handleTextChange.bind(null, 'guestLimit')}
            />
          </ListItem>

          <ListItem leftIcon={<Today />}>
            <DatePicker
              fullWidth={true}
              hintText="Pick a day"
              value={this.state.date}
              onChange={this.handleDateChange}
            />
          </ListItem>

          <ListItem leftIcon={<Time />}>
            <TimePicker
              fullWidth={true}
              hintText="Pick a time"
              value={this.state.time}
              onChange={this.handleTimeChange}
            />
          </ListItem>

          <ListItem leftIcon={<InsertPhoto />}>{this.renderUpload()}</ListItem>

          <ListItem leftIcon={<ImportContacts />}>
            <DropDownMenu
              value={this.state.importFrom}
              onChange={this.handleMenuChange}
            >
              <MenuItem
                value={NONE}
                label="Import guests from previous event"
                primaryText="None"
              />
              {this.props.events.map(e => (
                <MenuItem key={e.id} value={e.id} primaryText={e.title} />
              ))}
            </DropDownMenu>
          </ListItem>

          <ListItem leftIcon={<PlusOne />}>
            <Toggle
              label="Allow self enrollment:"
              thumbSwitchedStyle={{ backgroundColor: '#00e676' }}
              trackSwitchedStyle={{ backgroundColor: '#66ffa6' }}
              defaultToggled={true}
            />
          </ListItem>
        </List>

        <Fab className="fab" onClick={this.handleCreateEvent} secondary={true}>
          <DoneIcon style={{ fill: '#000' }} />
        </Fab>
      </div>
    );
  }
}

//Get a user from our store
const mapStoreToProps = store => {
  return {
    user: store.auth.userObject,
    uploadUrl: store.uploadUrl,
    events: store.events
  };
};

// subscribe to updates in teh store with `connect`
export default connect(mapStoreToProps, {
  addEvent,
  setHeader,
  uploadBanner,
  loadEvents
})(CreateEvent);
