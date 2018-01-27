import _ from 'lodash';

const getStdDeviation = values => {
  var avg = average(values);

  var squareDiffs = values.map(value => {
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
};

const average = data => {
  var sum = data.reduce((sum, value) => {
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
};

/* Credits to https://benmccormick.org/2017/05/11/building-normal-curves-highcharts/ */

const normalY = (x, mean, stdDev) =>
  Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));

export default values => {
  let mean = average(values);
  let stdDev = getStdDeviation(values);

  let min = mean - 2 * stdDev;
  let max = mean + 2 * stdDev;
  let unit = (max - min) / 100;
  let points = _.range(min, max, unit);

  let series = points.map(x => ({ x, y: normalY(x, mean, stdDev) }));

  return { series, stdDev, mean };
};
