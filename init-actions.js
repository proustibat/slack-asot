const addSeconds = require('date-fns/addSeconds');
const getUnixTime = require('date-fns/getUnixTime');
const { welcome, actions } = require('./blocks.json');

const initActions = app => {
  // Listens to incoming messages that contain "hi, hello, hey, salut, bonjour, etc"
  app.message(
    /^([Hh]i|[Hh]ello|[Hh]ey|[Ss]alut|[Bb]onjour|[Yy]o|:wave:).*/,
    async ({ say }) => {
      // say() sends a message to the channel where the event was triggered
      await say({ blocks: [...welcome, actions, { type: 'divider' }] });
    },
  );

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

  // Schedule a message to be sent to a channel.
  app.message(
    /^([Ff]uture|[Ff]utur|:calendar:|:date:|:spiral_calendar_pad:).*/,
    async ({ message, client, say }) => {
      await say(
        `\uD83E\uDD16 Alright <@${message.user}>!\n I'll contact you in the future!`,
      );
      const future = getUnixTime(addSeconds(new Date(), 30));
      await client.chat
        .scheduleMessage({
          channel: message.channel,
          post_at: future,
          text: `\uD83E\uDD16 Hi <@${message.user}>! This is the future you requested!`,
        })
        .catch(console.error);
    },
  );
};

module.exports = initActions;
