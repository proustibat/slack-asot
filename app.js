const { App, LogLevel } = require('@slack/bolt');

const initActions = require('./init-actions');
const initDatabase = require('./init-database');
const initUsers = require('./init-users');

(async () => {
  // Initializes your app with your bot token and signing secret
  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    // logLevel: LogLevel.DEBUG,
  });

  // Database
  const { dbRefUsers, dbRefAds } = await initDatabase();

  // Listen to actions and messages from the user
  initActions(app, dbRefUsers);

  // Schedule messages for each users
  // initUsers(app);

  // Send a message
  // await app.client.chat.postMessage({
  //   token: process.env.SLACK_BOT_TOKEN,
  //   channel: 'U0CFBDQ3D',
  //   text: `\uD83E\uDD16 Hi <@proustibat>! Message eclair!`,
  // });

  const PORT = process.env.APP_PORT || 3000;

  // Start your app
  await app.start(PORT);

  console.log(`⚡️ Bolt app is running on port ${PORT}!`);
})();
