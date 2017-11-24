import { event } from 'firebase-functions/lib/providers/analytics';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.acceptInvite = functions.database.ref('/invites/{inviteId}').onUpdate(event => {
	const userId = event.data.child('claimedByUser').val();
	const eventId = event.data.child('event').val();
	const isUsed = event.data.child('isUsed').val();
	const rootDb = admin.database().ref()

	if (!userId || !eventId || isUsed) {
		return;
	}

	let passObj = {
		user: userId,
		event: eventId,
		isUsed: false
	};

	let otherTablesPromise = new Promise((resolve, reject) => {
		rootDb
			.child(`/users/${userId}/events/${eventId}/invite`)
			.set(event.params.inviteId)
			.then(req => {
				rootDb
					.child('passes')
					.push(passObj)
					.then(pass => pass.once('value'))
					.then(snap => {
						rootDb
							.child(`/users/${userId}/events/${eventId}/pass`)
							.set(snap.key)
							.then(final => {
								resolve(final);
							})
							.catch(error => {
								reject(error);
							});
					})
					.catch(error => {
						reject(error);
					});
			})
			.catch(error => {
				reject(error);
			});
	});

	let updateInvitePromise = event.data.ref.child('isUsed').set(true);

	return Promise.all([
		otherTablesPromise,
		updateInvitePromise
	]);
});

/**
 * Triggers when a new message is added to an event's newsFeed. Then pushes a message to 
 * each user who has a pass for the event.
 */
exports.sendMessage = functions.database.ref('/events/{eventId}/newsFeed/{messageId}').onCreate(event => {
	const { snap } = event.data;

	// Notification details.
	const text = snap.val().text;
	const payload = {
		notification: {
			title: `${snapshot.val().title} posted ${text ? 'a message' : 'an image'}`,
			body: text ? (text.length <= 100 ? text : text.substring(0, 97) + '...') : ''
		}
	};

	// Get the list of device tokens.
	return admin.database().ref('/')
		.child('passes')
		.orderByChild(`event`)//query all passes for event
		.equalTo(event.params.eventId)
		.once('value')
		.then(passes => Object.keys(passes).map(k => passes[k].user))
		.then(guests => {
			let guestPromises = []
			guests.forEach(g => {
				guestPromises.push(admin.database.ref(`/users/${g}`).child('fcmToken').once('value'));
			});
			return Promise.all(guestPromises);
		})
		.then(tokensSnap => {
			if (tokensSnap) {
				const tokens = tokensSnap.map(s => s.val())
				// Send notifications to all tokens.
				return admin.messaging().sendToDevice(tokens, payload).then(response => {
					// For each message check if there was an error.
					const tokensToRemove = [];
					response.results.forEach((result, index) => {
						const error = result.error;
						if (error) {
							console.error('Failure sending notification to', tokens[index], error);
							// Cleanup the tokens who are not registered anymore.
							if (error.code === 'messaging/invalid-registration-token' ||
								error.code === 'messaging/registration-token-not-registered') {
								// tokensToRemove.push(allTokens.ref.child(tokens[index]).remove());
								//TODO remove invalid tokens
							}
						}
					});
					return Promise.all(tokensToRemove);
				});
			}
		});

});

/**
 * Triggers whenever a new user signs up and add them to the db.
 */
exports.addUser = functions.auth.user().onCreate(event => {
	let user = event.data;
	return firebase.database.ref(`/users/${user.uid}`).update(user)
})