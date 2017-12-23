const functions = require('firebase-functions');
const admin = require('firebase-admin');

const AcceptInvite = require('./src/AcceptInvite');
const AddUser = require('./src/AddUser');
const UpdateEventOwners = require('./src/UpdateEventOwners');
const GetInviteInfo = require('./src/GetInviteInfo');
const GenerateNewInvite = require('./src/GenerateNewInvite');
const SendMessage = require('./src/SendMessage');
const SendEmail = require('./src/SendEmail');
const GetEventStats = require('./src/GetEventStats');
const CheckInPass = require('./src/CheckInPass')
const ImportGuests = require('./src/ImportGuests')

admin.initializeApp(functions.config().firebase);

exports.acceptInvite = AcceptInvite(functions, admin);
exports.sendMessage = SendMessage(functions, admin);
exports.addUser = AddUser(functions, admin);
exports.updateEventOwners = UpdateEventOwners(functions, admin);
exports.getInviteInfo = GetInviteInfo(functions, admin);
exports.generateNewInvite = GenerateNewInvite(functions, admin);
exports.sendEmail = SendEmail(functions, admin);
exports.getEventStats = GetEventStats(functions, admin);
exports.checkInPass = CheckInPass(functions, admin);
exports.importGuests = ImportGuests(functions, admin);