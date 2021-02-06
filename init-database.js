const initDatabase = async () => {
  const admin = require('firebase-admin');

  // Fetch the service account key JSON file contents
  const serviceAccount = require('./serviceAccountKey.json');

  // Initialize the app with a service account, granting admin privileges
  const adminDbAppUsers = admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.DATABASE_ID_USERS}.firebaseio.com`,
    },
    'users',
  );
  const adminDbAppAds = admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.DATABASE_ID_ADS}.firebaseio.com`,
    },
    'ads',
  );

  const dbUsers = adminDbAppUsers.database();
  const dbAds = adminDbAppAds.database();
  const dbRefUsers = dbUsers.ref('/');
  const dbRefAds = dbAds.ref('/');

  // await dbRefUsers.once('value', function (snapshot) {
  //   console.log(snapshot.val());
  // });

  // await dbRefAds.once('value', function (snapshot) {
  //   console.log(snapshot.val());
  // });

  return { dbRefUsers, dbRefAds };
};

module.exports = initDatabase;
