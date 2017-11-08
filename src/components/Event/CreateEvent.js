import React from 'react';
import './CreateEvent.css';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import AppBar from 'material-ui/AppBar';

import { connect } from 'react-redux';
import { addEvent } from '../../actions/EventsActions';

/**
 * This is a simple presentational component that shows some input fields. When the user is done 
 * inputting information we dispatch an addEvent to the reducer.
 * 
 * @param {function} dispatch is passed in from `connect`. 
 * @param {UserModel} user is passed in from `mappStoreToProps`. 
 */
let CreateEvent = ({ dispatch, user }) => {
  let titleInput,
    locationInput,
    descInput,
    dateInput,
    timeInput,
    maxGuestsInput;
  return (
    <div>
      <AppBar title="OnePlusTwo" iconElementLeft={<div />} />
      <TextField
        floatingLabelStyle={{ top: '16px' }}
        style={{ maxHeight: '48px', marginTop: '24px' }}
        floatingLabelText="Event Title"
        ref={node => {
          node && (titleInput = node.input);
        }}
      />
      <TextField
        floatingLabelStyle={{ top: '16px' }}
        style={{ maxHeight: '48px' }}
        floatingLabelText="Location"
        ref={node => {
          node && (locationInput = node.input);
        }}
      />
      <TextField
        floatingLabelStyle={{ top: '16px' }}
        style={{ maxHeight: '48px' }}
        floatingLabelText="Description"
        ref={node => {
          node && (descInput = node.input);
        }}
      />
      <DatePicker
        hintText="Pick a day"
        ref={node => {
          node && (dateInput = node);
        }}
      />
      <TimePicker
        hintText="Pick a time"
        ref={node => {
          node && (timeInput = node);
        }}
      />
      <TextField
        floatingLabelStyle={{ top: '16px' }}
        style={{ maxHeight: '48px' }}
        floatingLabelText="Max guests"
        type="number"
        ref={node => {
          node && (maxGuestsInput = node.input);
        }}
      />

      <div className="CreateEvent-menu">
        <DropDownMenu value={1} className="CreateEvent-spinner">
          <MenuItem
            value={1}
            label="Import guests from previous event"
            primaryText="None"
          />
          <MenuItem value={2} primaryText="Bake Sale" />
          <MenuItem value={3} primaryText="Ultimate Game" />
        </DropDownMenu>
      </div>
      <div>
        <Toggle
          className="CreateEvent-switch"
          label="Allow self enrollment:"
          thumbSwitchedStyle={{ backgroundColor: '#76FF03' }}
          trackSwitchedStyle={{ backgroundColor: '#CCFF90' }}
          defaultToggled={true}
        />
      </div>
      <RaisedButton
        className="CreateEvent-button"
        label="SAVE EVENT"
        primary={true}
        onClick={_ =>
          dispatch(
            addEvent(
              titleInput.value,
              locationInput.value,
              descInput.value,
              dateInput.state.date,
              timeInput.state.time,
              maxGuestsInput.value,
              user.id,
              false
            )
          )}
      />
    </div>
  );
};

//Get a user from our store
const mapStoreToProps = store => {
  return {
    user: store.user
  };
};

// subscribe to updates in teh store with `connect`
CreateEvent = connect(mapStoreToProps)(CreateEvent);
export default CreateEvent;
