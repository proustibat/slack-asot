const { App, LogLevel } = require('@slack/bolt');

const { listenMessages, listenActions } = require('./init-listeners');
const { initDatabase } = require('./database');
const initUsers = require('./init-users');

const PORT = process.env.APP_PORT || 3000;

(async () => {
  // Init Slack Bolt App
  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    // logLevel: LogLevel.DEBUG,
  });

  // Init database
  await initDatabase();

  // Listen to messages
  await listenMessages(app);

  // Listen to actions
  await listenActions(app);

  // Schedule messages for each users
  // initUsers(app);

  // Send a message
  // await app.client.chat.postMessage({
  //   token: process.env.SLACK_BOT_TOKEN,
  //   channel: 'U0CFBDQ3D',
  //   text: `\uD83E\uDD16 Hi <@proustibat>! Message eclair!`,
  // });

  // Start the app
  await app.start(PORT);

  console.log(`⚡️ Bolt app is running on port ${PORT}!`);
})();
