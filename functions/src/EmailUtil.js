const nodemailer = require('nodemailer');

const EmailUtil = (functions) => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: functions.config().gmail.email,
      pass: functions.config().gmail.password
    }
  });
};

module.exports = EmailUtil;