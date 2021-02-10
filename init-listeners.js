const {
  getNextAds,
  getNextAdsAfterCursor,
  createUser,
  getUser,
  setUserSubscription,
} = require('./database');
const { welcome, actions } = require('./blocks.json');
const renderList = require('./renderList');

const boltActions = {
  SUBSCRIBE: 'subscribeAll',
  UNSUBSCRIBE: 'unsubscribeAll',
  SHOW: 'showAds',
  SHOW_NEXT: 'showNextAds',
  SHOW_SUBSCRIBED: 'showSubscribedAds',
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

  // app.message(
  //   /^([Ff]uture|[Ff]utur|:calendar:|:date:|:spiral_calendar_pad:).*/,
  //   async ({ message, client, say }) => {
  //     await say(
  //       `\uD83E\uDD16 Alright <@${message.user}>!\n I'll contact you in the future!`,
  //     );
  //     const future = getUnixTime(addSeconds(new Date(), 30));
  //     // Schedule a message to be sent to a channel.
  //     await client.chat
  //       .scheduleMessage({
  //         channel: message.channel,
  //         post_at: future,
  //         text: `\uD83E\uDD16 Hi <@${message.user}>! This is the future you requested!`,
  //       })
  //       .catch(console.error);
  //   },
  // );
};

const createOrUpdateUser = async (userSlack, subscribe) => {
  let userDatabase = await getUser(userSlack.id);

  return userDatabase
    ? userDatabase.hasSubscribed === subscribe
      ? { already: true }
      : await setUserSubscription(userDatabase.id, subscribe)
    : await createUser({
        ...userSlack,
        hasSubscribed: subscribe,
      });
};

const listenActions = app => {
  app.action(boltActions.SUBSCRIBE, async ({ body, ack, say }) => {
    console.log('SUBSCRIBE');
    await ack();

    const result = await createOrUpdateUser(body.user, true);

    if (result?.already) {
      await say("\uD83E\uDD16 You've already subscribed to all ads!");
    } else {
      await say(
        "\uD83E\uDD16 Here we go!\n:gear: I'm cooking a fabulous receipt for you, please be patient, I'll tell you when it will be ready...",
      );

      // TODO: schedule message for each ads in database

      await new Promise(resolve => setTimeout(resolve, 5000));

      await say("📺 Ok great! You've subscribed to all ads!");
    }
  });

  app.action(boltActions.UNSUBSCRIBE, async ({ body, ack, say }) => {
    console.log('UNSUBSCRIBE');
    await ack();

    const result = await createOrUpdateUser(body.user, false);

    if (result?.already) {
      await say("\uD83E\uDD16 You've already unsubscribed from all ads!");
    } else {
      await say(
        `\uD83E\uDD16 Alright!\n:gear: Please wait a moment, I'm erasing you from my life, please be patient, I'll tell you when it will be done...`,
      );

      // TODO: get schedules messages and remove it

      await new Promise(resolve => setTimeout(resolve, 5000));

      await say("⛔ Ok great! You've unsubscribed from all ads notifications!");
    }
  });

  app.action(boltActions.SHOW, async ({ ack, say }) => {
    await ack();
    const ads = await getNextAds();
    await say(renderList(ads));
  });

  app.action(boltActions.SHOW_NEXT, async ({ ack, respond }) => {
    await ack();
    const ads = await getNextAdsAfterCursor();
    await respond(renderList(ads));
  });

  app.action(boltActions.SHOW_SUBSCRIBED, async ({ ack, body }) => {
    await ack();
    console.log(body.user);
  });
};

module.exports = { listenMessages, listenActions, boltActions };
