import React, { Component } from 'react';
import './ShowStatsDialog.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Loader from '../Common/Loader';

import { Pie, Line } from 'react-chartjs-2';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import _ from 'lodash';

import { getEventStats } from '../../actions/EventsActions';

import NormalDistribution from '../../util/NormalDistribution';

const style = {
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

class ShowStatsDialog extends Component {
  componentWillReceiveProps(newProps) {
    if (newProps.show && !this.props.show) {
      this.props.getEventStats(this.props.event.id);
    }
  }

  render() {
    let actions = [
      <FlatButton
        label="Close"
        onClick={_ => {
          this.props.onClose();
          this.setState({ clicked: false });
        }}
      />
    ];

    let content = <Loader />;

    if (this.props.eventStats) {
      let dates = this.props.eventStats.checkInTimes.map(x =>
        new Date(x).getTime()
      );
      let { series, mean, stdDev } = NormalDistribution(dates);
      let minDate = _.min(series.map(o => o.x));
      let maxDate = _.max(series.map(o => o.x));
      series = series.map(obj => ({
        x: (obj.x - minDate) / (maxDate - minDate),
        y: obj.y * 100
      }));

      let attendanceData = {
        labels: ['Unused Invites', "Didn't Show Up", 'Attendees'],
        datasets: [
          {
            data: [
              this.props.eventStats.totalInvites -
                this.props.eventStats.acceptedInvites,
              this.props.eventStats.acceptedInvites -
                this.props.eventStats.usedPasses,
              this.props.eventStats.usedPasses
            ],
            backgroundColor: ['#F4B9B2', '#DAEDBD', '#7DBBC3'],
            hoverBackgroundColor: ['#F4C8C3', '#E1EDD0', '#8FBBC1']
          }
        ]
      };

      let genderData = {
        labels: ['Female', 'N/A', 'Male'],
        datasets: [
          {
            data: [
              this.props.eventStats.genderStats.female,
              this.props.eventStats.genderStats.na,
              this.props.eventStats.genderStats.male
            ],
            backgroundColor: ['#F4B9B2', '#DDDDDD', '#7DBBC3'],
            hoverBackgroundColor: ['#F4C8C3', '#EEEEEE', '#8FBBC1']
          }
        ]
      };

      let meanPosition = (mean - minDate) / (maxDate - minDate);
      let oneHourPlus = new Date(mean + stdDev);

      let oneHourPlusPosition =
        (oneHourPlus.getTime() - minDate) / (maxDate - minDate);

      let lineData = {
        labels: [],
        datasets: [
          {
            type: 'line',
            label: 'Check-in Time Distribution',
            data: series,
            borderColor: '#7DBBC3',
            backgroundColor: '#7DBBC3',
            pointRadius: 0,
            fill: false
          }
        ]
      };

      let lineOptions = {
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [
            {
              type: 'linear',
              ticks: {
                display: false
              },
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                min: 0,
                max: 103,
                display: false
              },
              gridLines: {
                display: false
              }
            }
          ]
        },
        annotation: {
          annotations: [
            {
              type: 'line',
              mode: 'vertical',
              scaleID: 'x-axis-0',
              value: meanPosition,
              borderColor: 'red',
              label: {
                content: `most active @ ${
                  new Date(mean).getHours() > 9
                    ? new Date(mean).getHours()
                    : '0' + new Date(mean).getHours()
                }:${new Date(mean).getMinutes()}`,
                enabled: true,
                position: 'middle'
              }
            },
            {
              type: 'line',
              mode: 'vertical',
              scaleID: 'x-axis-0',
              value: oneHourPlusPosition,
              borderColor: 'orange',
              label: {
                content: `+${oneHourPlus.getHours() -
                  new Date(mean).getHours()}:${oneHourPlus.getMinutes() -
                  new Date(mean).getMinutes()}h`,
                enabled: true,
                position: 'middle'
              }
            }
          ]
        }
      };

      content = (
        <div>
          <div className="AttendanceBox">
            <h2>Attendance:</h2>
            <Pie data={attendanceData} />
          </div>

          <div className="GenderBox">
            <h2>Gender Breakdown:</h2>
            <Pie data={genderData} />
          </div>

          <div className="TimelineBox">
            <h2>Check-in times:</h2>
            <Line
              options={lineOptions}
              data={lineData}
              width="400"
              height="150"
            />
          </div>

          <div className="TimelineBox">
            <h2>Average age:</h2>
            <strong>{this.props.eventStats.averageAge}</strong>
          </div>
        </div>
      );
    }

    return (
      <Dialog
        title={`Statistics for ${this.props.event.title}`}
        actions={actions}
        modal={true}
        open={this.props.show}
        onRequestClose={this.props.onClose}
      >
        <div style={style.buttonWrapper} className="ShowStatsDialog">
          {content}
        </div>
      </Dialog>
    );
  }
}

ShowStatsDialog.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  event: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  return {
    eventStats: state.eventStats
  };
};

export default connect(mapStateToProps, { getEventStats })(ShowStatsDialog);
