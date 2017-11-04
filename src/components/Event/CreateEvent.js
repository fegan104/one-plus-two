import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import { connect } from 'react-redux';
//import { addEvent } from '../../actions/EventsActions.js';

/**
 * This is a simple presentational component that shows some input fields. When the suer is done 
 * inputting information we dispatch an addEvent to the reducer.
 * 
 * @param {function} dispatch is passed in from `connect`. 
 */
let CreateEvent = ({ dispatch, user }) => {
  let nameInput, locationInput, descInput, dateInput, timeInput, maxGuestsInput;
  return (
    <div>
      <TextField
        hintText="Event Name"
        ref={node => {
          node && (nameInput = node.input);
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
      <RaisedButton label="NEXT" />
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
