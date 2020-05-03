const admin = require("firebase-admin")
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

// local
// var serviceAccount = require('./cric-677e48f98a03.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://cric-bdc72.firebaseio.com'
// });

// deploy
admin.initializeApp();

const firestore = admin.firestore()

exports.allMatches = functions.https.onRequest(async (request, response) => {
  cors(request, response, () => {});
  const snapshot = await firestore
    .collection('matches')
    .get();
  response.send(snapshot.docs.map(doc => doc.data()));
});

exports.getSeries = functions.https.onRequest(async (request, response) => {
  cors(request, response, () => {});
  const snapshot = await firestore
    .collection('matches')
    .get();
  const data1 = snapshot.docs.map(doc => {
    const d = doc.data();
    return {
      id: doc.id,
      series: d.series,
      team1: d.team1,
      team2: d.team2,
      created: doc.createTime.seconds,
    };
  })
  .sort((a, b) => b.created - a.created);
  response.send(data1);
});

// exports.updatePlayer = functions.firestore
//   .document('matches/{docId}')
//   .onCreate((change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    // const newValue = change.after.data();

    // ...or the previous value before this update
    // const previousValue = change.before.data();
    // console.log('fired------------', context.params.docId);

    // access a particular field as you would any JS property
    // const name = newValue.name;
    // debugger;

    // perform desired operations ...
  // });


