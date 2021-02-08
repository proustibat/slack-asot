const getUnixTime = require('date-fns/getUnixTime');
const admin = require('firebase-admin');

// Fetch the service account key JSON file contents
const serviceAccount = require('./serviceAccountKey.json');

let dbRefUsers = null;
let dbRefAds = null;
let cursorQueryAds = null;
const LIMIT = 5;
const DB_NAMES = {
  USERS: 'users',
  ADS: 'ads',
};

const initDatabase = async () => {
  // Initialize the app with a service account, granting admin privileges
  admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.DATABASE_ID_USERS}.firebaseio.com`,
    },
    DB_NAMES.USERS,
  );
  admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.DATABASE_ID_ADS}.firebaseio.com`,
    },
    DB_NAMES.ADS,
  );

  dbRefUsers = admin.app(DB_NAMES.USERS).database().ref('/');
  dbRefAds = admin.app(DB_NAMES.ADS).database().ref('/');
};

const handleAdsQuery = resolve => snapshot => {
  const results = Object.entries(snapshot.val());
  cursorQueryAds = results[results.length - 1][0];
  resolve(results.flatMap(item => ({ ...item[1] })));
};

const getNextAds = async () => {
  return new Promise(async (resolve, reject) => {
    if (!dbRefAds) reject('database ref is not initialized');

    await dbRefAds
      .orderByChild('datetime_timestamp')
      .startAt(getUnixTime(Date.now()))
      .limitToFirst(LIMIT)
      .once('value', handleAdsQuery(resolve, reject));
  });
};

const getNextAdsAfterCursor = async () => {
  return new Promise(async (resolve, reject) => {
    if (!cursorQueryAds) reject('No pagination in progress');
    if (!dbRefAds) reject('database ref is not initialized');
    await dbRefAds
      .orderByKey()
      .startAt(cursorQueryAds)
      .limitToFirst(LIMIT)
      .once('value', handleAdsQuery(resolve, reject));
  });
};

const getDbRefAds = () => dbRefAds;
const getDbRefUsers = () => dbRefUsers;

module.exports = {
  initDatabase,
  getDbRefAds,
  getDbRefUsers,
  getNextAds,
  getNextAdsAfterCursor,
};
