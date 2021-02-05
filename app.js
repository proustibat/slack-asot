const { App } = require('@slack/bolt');
const { welcome, actions } = require('./blocks.json');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Listens to incoming messages that contain "hi"
app.message('hi', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [...welcome, actions, { type: 'divider' }],
  });
});

app.action('start', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(
    `\uD83E\uDD16 Here we go <@${body.user.id}>!\n📺 I'll inform you about the next ads!`,
  );
});

app.action('stop', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(
    `\uD83E\uDD16 Alright <@${body.user.id}>!\n⛔ You won't be informed about the next ads!`,
  );
});

app.action('list', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(
    `\uD83E\uDD16 Alright <@${body.user.id}>!\n🗓 Here are the next ads times!`,
  );
});

(async () => {
  const PORT = process.env.APP_PORT || 3000;

  // Start your app
  await app.start(PORT);

  console.log(`⚡️ Bolt app is running on port ${PORT}!`);
})();
