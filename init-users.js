const addSeconds = require('date-fns/addSeconds');
const addMinutes = require('date-fns/addMinutes');
const getUnixTime = require('date-fns/getUnixTime');

const initUsers = async ({ client }) => {
  // const testResult = await client.auth.test();
  // console.log(testResult);
  // You probably want to use a database to store any user information ;)
  let usersStore = {};

  try {
    const listResult = await client.users.list({
      token: process.env.SLACK_BOT_TOKEN,
    });
    //
    await scheduleMessages(listResult.members);

    // console.log('GET SCHEDULED MESSAGES');
    // const scheduledMessages = await client.chat.scheduledMessages.list({
    //   token: process.env.SLACK_BOT_TOKEN,
    //   // channel: 'D01MJ0JAVS5',
    // });
    // console.log(scheduledMessages);
  } catch (error) {
    console.error(error);
  }

  // Put users into the JavaScript object
  async function scheduleMessages(members) {
    let userId = '';

    for (const user of members) {
      // Key user info on their unique user ID
      userId = user['id'];

      // Store the entire user object (you may not need all of the info)
      if (user.name !== 'slackbot' && !user.is_bot && !user.deleted) {
        usersStore[userId] = user;

        const futureSeconds = getUnixTime(addSeconds(new Date(), 15));
        const futureOneMinute = getUnixTime(addMinutes(new Date(), 1));
        const futureTwoMinutes = getUnixTime(addMinutes(new Date(), 2));
        try {
          await client.chat.scheduleMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: userId,
            post_at: futureSeconds,
            text: `\uD83E\uDD16 Hi <@${user.name}>! This is the future you requested 15 seconds ago!`,
          });
          await client.chat.scheduleMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: userId,
            post_at: futureOneMinute,
            text: `\uD83E\uDD16 Hi <@${user.name}>! This is the future you requested one minute ago!`,
          });
          await client.chat.scheduleMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: userId,
            post_at: futureTwoMinutes,
            text: `\uD83E\uDD16 Hi <@${user.name}>! This is the future you requested two minutes ago!`,
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
};

module.exports = initUsers;
