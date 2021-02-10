const {
  getNextAds,
  getNextAdsAfterCursor,
  createUser,
  getUser,
  setUserSubscription,
} = require('./database');
const {
  welcome,
  actions,
  subscriptionsActionsSays,
  sayInProgress,
} = require('./blocks.json');
const renderList = require('./renderList');
const {
  deleteAllScheduledMessages,
  schedulesAllMessages,
  getScheduledMessage,
} = require('./slack-api');

const boltActions = {
  SUBSCRIBE: 'subscribeAll',
  UNSUBSCRIBE: 'unsubscribeAll',
  SHOW: 'showAds',
  SHOW_NEXT: 'showNextAds',
  SHOW_SUBSCRIBED: 'showSubscribedAds',
};

let actionInProgress = false;

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

const toggleSubscriptions = async ({ body, ack, say }) => {
  actionInProgress = true;
  const saysNode = body.actions[0].action_id;
  const result = await createOrUpdateUser(
    body.user,
    saysNode === boltActions.SUBSCRIBE,
  );
  if (result?.already) {
    await say(subscriptionsActionsSays[saysNode].already);
  } else {
    await say(subscriptionsActionsSays[saysNode].loading);
    await (saysNode === boltActions.SUBSCRIBE
      ? schedulesAllMessages
      : deleteAllScheduledMessages)(body.user.id);
    await say(subscriptionsActionsSays[saysNode].done);
  }
  actionInProgress = false;
};

const showAdsAction = async ({ ack, body, say, respond }) => {
  actionInProgress = true;
  const action = body.actions[0].action_id;

  const ads = await (action === boltActions.SHOW
    ? getNextAds
    : getNextAdsAfterCursor)();
  await (action === boltActions.SHOW ? say : respond)(renderList(ads));
  actionInProgress = false;
};

const showSubscribedAds = async ({ ack, body, say }) => {
  console.log('SHOW SUBSCRIBED ADS');
  actionInProgress = true;

  // TODO: get user
  //  --> if user doesn't exist, send a message to propose subscription
  //  --> if user exists, check if he has subscribed
  //      --> if no, send a message to propose subscription
  //      --> if yes, getScheduledMessages

  await getScheduledMessage(body.user.id);

  //TODO: for each message, renderList
  await say('TODO');
  actionInProgress = false;
};

const blockUi = async ({ ack, say, next }) => {
  await ack();
  if (actionInProgress) {
    await say(sayInProgress);
  } else {
    await next();
  }
};

const listenActions = app => {
  app.action(boltActions.SUBSCRIBE, blockUi, toggleSubscriptions);
  app.action(boltActions.UNSUBSCRIBE, blockUi, toggleSubscriptions);

  app.action(boltActions.SHOW, blockUi, showAdsAction);
  app.action(boltActions.SHOW_NEXT, blockUi, showAdsAction);

  app.action(boltActions.SHOW_SUBSCRIBED, blockUi, showSubscribedAds);
};

module.exports = { listenMessages, listenActions, boltActions };
