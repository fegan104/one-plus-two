export default ({
  id,
  desc,
  guestLimit,
  spotsLeft,
  isSelfEnrollable,
  canBringXPeople,
  location,
  owners,
  picture,
  stats,
  title,
  dateTime,
  ...rest
}) => ({
  id: id || null,
  desc: desc || '',
  guestLimit: guestLimit || 1,
  spotsLeft: spotsLeft || 1,
  isSelfEnrollable: isSelfEnrollable || false,
  canBringXPeople: canBringXPeople || 1,
  location: location || '',
  newsFeed: [], // TODO
  owners: owners || {},
  picture: picture || '',
  stats: stats || {},
  title: title || '',
  dateTime: dateTime || ''
});
// ({
//   "desc": "desc",
//   "guestLimit": 10,
//   "isSelfEnrollable": true,
//   "canBringXPeople": true,
//   "spotsLeft": 10,
//   "location": "worcester",
//   "picture": "imgur",
//   "title": "foo",
//   "newsFeed": true,
//   "dateTime": "now",
//   "owners": {
//     "db20502a-9e24-4c8d-b4c1-b8ef491d9b18": true
//   }
// })

//   ({
//     canBringXPeople: 1,
//     dateTime: "Mon, 27 Nov 2017 15:48:45 GMT",
//     desc: "desc",
//     guestLimit: "9",
//     id: null,
//     isSelfEnrollable: false,
//     location:"100 Instititute",
//     newsFeed:[],
//     owners:{ CUkGiCPmLpQlYQz2tgQ3yEYMIQE3: true },
//     picture:"https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/1779935/580/386/m1/fpnw/wm0/birthday-cover-cm-.png?1476896893&s=66be6fe4b5239df58e7bddd6d8c63189",
//     spotsLeft: null
//    stats :
//       null
//   title
//       :
//       "foo"
//   })
