const { App } = require('@slack/bolt');
const initActions = require('./init-actions');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

initActions(app);

(async () => {
  const PORT = process.env.APP_PORT || 3000;

  // Start your app
  await app.start(PORT);

  console.log(`⚡️ Bolt app is running on port ${PORT}!`);
})();
