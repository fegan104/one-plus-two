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

import { connect } from 'react-redux';
import { addEvent } from '../../actions/EventsActions';
import { setHeader } from '../../actions/HeaderActions';

import EventModel from '../../models/EventModel';

class CreateEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
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

  handleCreateEvent = () => {
    let { user, addEvent } = this.props;

    let owners = {};
    owners[user.id] = true;

    let selectedTime = new Date(this.state.time);
    let dateTime = new Date(this.state.date);
    dateTime.setHours(selectedTime.getHours());
    dateTime.setMinutes(selectedTime.getMinutes());

    addEvent(
      EventModel({
        ...this.state,
        dateTime: dateTime.toUTCString(),
        owners,
        isSelfEnrollable: false
      })
    );
  };

  componentDidMount() {
    this.configureAppHeader();
  }

  configureAppHeader = () => {
    this.props.setHeader({
      pageTitle: 'Creating a New Event',
      headerTitle: 'New Event',
      backButton: '/'
    });
  };

  render() {
    return (
      <div>
        <List className="CreateEvent-list">
          <ListItem
            leftIcon={<Title />}
            children={
              <TextField
                floatingLabelText="Event Title"
                fullWidth={true}
                value={this.state.title}
                onChange={this.handleTextChange.bind(null, 'title')}
              />
            }
          />

          <ListItem
            leftIcon={<Subject />}
            children={
              <TextField
                style={{ textAlign: 'left' }}
                floatingLabelText="Description"
                fullWidth={true}
                multiLine={true}
                rows={2}
                value={this.state.desc}
                onChange={this.handleTextChange.bind(null, 'desc')}
              />
            }
          />
          <ListItem
            leftIcon={<Location />}
            children={
              <TextField
                fullWidth={true}
                floatingLabelText="Location"
                value={this.state.location}
                onChange={this.handleTextChange.bind(null, 'location')}
              />
            }
          />
          <ListItem
            leftIcon={<People />}
            children={
              <TextField
                floatingLabelText="Max guests"
                fullWidth={true}
                type="number"
                value={this.state.guestLimit}
                onChange={this.handleTextChange.bind(null, 'guestLimit')}
              />
            }
          />
          <ListItem
            leftIcon={<Today />}
            children={
              <DatePicker
                fullWidth={true}
                hintText="Pick a day"
                value={this.state.date}
                onChange={this.handleDateChange}
              />
            }
          />
          <ListItem
            leftIcon={<Time />}
            children={
              <TimePicker
                fullWidth={true}
                hintText="Pick a time"
                value={this.state.time}
                onChange={this.handleTimeChange}
              />
            }
          />
          <ListItem
            leftIcon={<InsertPhoto />}
            children={
              <TextField
                floatingLabelText="Link to event banner image"
                fullWidth={true}
                value={this.state.picture}
                onChange={this.handleTextChange.bind(null, 'picture')}
              />
            }
          />
          <ListItem
            leftIcon={<ImportContacts />}
            children={
              <DropDownMenu value={1}>
                <MenuItem
                  value={1}
                  label="Import guests from previous event"
                  primaryText="None"
                />
                <MenuItem value={2} primaryText="Bake Sale" />
                <MenuItem value={3} primaryText="Ultimate Game" />
              </DropDownMenu>
            }
          />
          <ListItem
            leftIcon={<PlusOne />}
            children={
              <Toggle
                label="Allow self enrollment:"
                thumbSwitchedStyle={{ backgroundColor: '#76FF03' }}
                trackSwitchedStyle={{ backgroundColor: '#CCFF90' }}
                defaultToggled={true}
              />
            }
          />
        </List>

        <Fab className="fab" onClick={this.handleCreateEvent}>
          <DoneIcon />
        </Fab>
      </div>
    );
  }
}

//Get a user from our store
const mapStoreToProps = store => {
  return {
    user: store.auth.userObject
  };
};

// subscribe to updates in teh store with `connect`
export default connect(mapStoreToProps, { addEvent, setHeader })(CreateEvent);
