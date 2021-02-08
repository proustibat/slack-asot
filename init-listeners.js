const addSeconds = require('date-fns/addSeconds');
const getUnixTime = require('date-fns/getUnixTime');
const {
  getDbRefUsers,
  getNextAds,
  getNextAdsAfterCursor,
} = require('./database');
const { welcome, actions } = require('./blocks.json');
const renderList = require('./renderList');

const boltActions = {
  START: 'start',
  STOP: 'stop',
  LIST: 'list',
};

const listenMessages = app => {
  app.message(
    /^([Hh]i|[Hh]ello|[Hh]ey|[Ss]alut|[Bb]onjour|[Yy]o|:wave:|[Hh]elp|:sos:).*/,
    async ({ say }) => {
      await say({ blocks: [...welcome, actions, { type: 'divider' }] });
    },
  );

  app.message(/^([Cc]ommande?s?|[Aa]ctions?).*/, async ({ say }) => {
    await say({ blocks: [actions, { type: 'divider' }] });
  });

  app.message(
    /^([Ff]uture|[Ff]utur|:calendar:|:date:|:spiral_calendar_pad:).*/,
    async ({ message, client, say }) => {
      await say(
        `\uD83E\uDD16 Alright <@${message.user}>!\n I'll contact you in the future!`,
      );
      const future = getUnixTime(addSeconds(new Date(), 30));
      // Schedule a message to be sent to a channel.
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

const listenActions = app => {
  app.action(boltActions.START, async ({ body, ack, say }) => {
    await ack();
    await getDbRefUsers().set({
      [body.user.id]: {
        ...body.user,
        hasSubscribed: true,
      },
    });
    await say(
      `\uD83E\uDD16 Here we go <@${body.user.id}>!\n📺 I'll inform you about the next ads!`,
    );
  });

  app.action(boltActions.STOP, async ({ body, ack, say }) => {
    await ack();
    await getDbRefUsers().set({
      [body.user.id]: {
        ...body.user,
        hasSubscribed: false,
      },
    });
    await say(
      `\uD83E\uDD16 Alright <@${body.user.id}>!\n⛔ You won't be informed about the next ads!`,
    );
  });

  app.action(boltActions.LIST, async ({ ack, say }) => {
    await ack();
    const ads = await getNextAds();
    await say(renderList(ads));
  });

  app.action('listNextAds', async ({ ack, respond }) => {
    await ack();
    const ads = await getNextAdsAfterCursor();
    await respond(renderList(ads));
  });
};

module.exports = { listenMessages, listenActions, boltActions };
