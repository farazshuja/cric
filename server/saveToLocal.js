const admin = require('firebase-admin');

const serviceAccount = require('./cric-677e48f98a03.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function saveMatchesBySeries() {
  const snapshot = await db.collection('matches').where('series', '==', 'Series-12').get();
  const matches = [];
  snapshot.docs.forEach((doc) => {
    matches.push(doc.data());
  });
  console.log(JSON.stringify(matches));
}

saveMatchesBySeries();
