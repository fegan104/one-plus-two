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

class CreateEvent extends Component {
  componentDidMount() {
    this.configureAppHeader();
  }

  componentDidUpdate() {
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
    let { addEvent, user } = this.props;

    let titleInput,
      locationInput,
      descInput,
      dateInput,
      timeInput,
      maxGuestsInput,
      photoInput;

    return (
      <div>
        <List className="CreateEvent-list">
          <ListItem
            leftIcon={<Title />}
            children={
              <TextField
                floatingLabelText="Event Title"
                fullWidth={true}
                ref={node => {
                  node && (titleInput = node.input);
                }}
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
                ref={node => {
                  node && (descInput = node.input.refs.input);
                }}
              />
            }
          />
          <ListItem
            leftIcon={<Location />}
            children={
              <TextField
                fullWidth={true}
                floatingLabelText="Location"
                ref={node => {
                  node && (locationInput = node.input);
                }}
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
                ref={node => {
                  node && (maxGuestsInput = node.input);
                }}
              />
            }
          />
          <ListItem
            leftIcon={<Today />}
            children={
              <DatePicker
                fullWidth={true}
                hintText="Pick a day"
                ref={node => {
                  node && (dateInput = node);
                }}
              />
            }
          />
          <ListItem
            leftIcon={<Time />}
            children={
              <TimePicker
                fullWidth={true}
                hintText="Pick a time"
                ref={node => {
                  node && (timeInput = node);
                }}
              />
            }
          />
          <ListItem
            leftIcon={<InsertPhoto />}
            children={
              <TextField
                floatingLabelText="Link to event banner image"
                fullWidth={true}
                ref={node => {
                  node && (photoInput = node.input);
                }}
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

        <Fab
          className="fab"
          onClick={_ =>
            addEvent({
              title: titleInput.value,
              location: locationInput.value,
              desc: descInput.value,
              date: dateInput.state.date,
              time: timeInput.state.time,
              guestLimit: maxGuestsInput.value,
              picture: photoInput.value,
              owner: user.id,
              isSelfEnrollable: false
            })}
        >
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
