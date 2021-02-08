const { getChannelLink } = require('./channels');

const renderList = adsData => {
  const intro = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `🤖 Here are the next *${adsData.length} ad${
          adsData.length > 1 ? 's' : ''
        }* on french channels:`,
      },
    },
    {
      type: 'divider',
    },
  ];

  const adsBlocks = adsData
    .map(item => [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:tv: *<${getChannelLink(item.channel_name)}|${item.date} at ${
            item.time
          }>*\nBetween _${
            item.before !== '' ? item.before : '¯\\_(ツ)_/¯'
          }_ and _${item.after !== '' ? item.after : '¯\\_(ツ)_/¯'}_\nScreen: ${
            item.screen
          }`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'plain_text',
            text: `:satellite_antenna: ${item.channel_name}`,
            emoji: true,
          },
        ],
      },
      {
        type: 'divider',
      },
    ])
    .flat();

  const actions = [
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: 'Next ads',
          },
          action_id: 'listNextAds',
        },
      ],
    },
  ];

  return {
    blocks: [...intro, ...adsBlocks, ...actions],
  };
};

module.exports = renderList;
