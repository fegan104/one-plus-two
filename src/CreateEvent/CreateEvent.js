import React, { Component } from "react";
import TextField from 'material-ui/TextField'

/**
 * This is the container component for the event creation screen.
 */
class CreateEvent extends Component {
  render() {
    return (
      <div>
        <TextField hintText="Event Name"></TextField>
        <TextField hintText="Location"></TextField>
        <TextField hintText="Description"></TextField>
        <TextField hintText="Date and Time"></TextField>
      </div>
    )
  }
}

export default CreateEvent