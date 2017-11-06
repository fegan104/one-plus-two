import React from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';

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
      <TextField
        hintText="Event Title"
        ref={node => {
          node && (titleInput = node.input);
        }}
      />
      <TextField
        hintText="Location"
        ref={node => {
          node && (locationInput = node.input);
        }}
      />
      <TextField
        hintText="Description"
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
        hintText="Max guests"
        type="number"
        ref={node => {
          node && (maxGuestsInput = node.input);
        }}
      />

      <div>
        <div>Import guests from previous event</div>
        <DropDownMenu label="Import guests from previous event" value={1}>
          <MenuItem value={1} primaryText="Event 1" />
          <MenuItem value={2} primaryText="Event 2" />
          <MenuItem value={3} primaryText="Cool event" />
        </DropDownMenu>
      </div>
      <div>
        <Toggle label="Allow self enrollment" defaultToggled={true} />
      </div>
      <RaisedButton
        label="SAVE EVENT"
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
