const scheduleMessage = async (userId, adsData) => {};

const schedulesAllMessages = async userId => {
  return await new Promise(resolve => setTimeout(resolve, 5000));
};

const deleteScheduledMessage = (userId, messageId) => {};

const deleteAllScheduledMessages = async userId => {
  await new Promise(resolve => setTimeout(resolve, 5000));
};

const getScheduledMessage = async userId => {
  await new Promise(resolve => setTimeout(resolve, 5000));
};

module.exports = {
  scheduleMessage,
  schedulesAllMessages,
  deleteScheduledMessage,
  deleteAllScheduledMessages,
  getScheduledMessage,
};
