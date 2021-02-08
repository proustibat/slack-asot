const channels = [
  {
    name: 'TF1',
    url: 'https://www.tf1.fr/tf1/direct',
  },
  {
    name: 'France 2',
    url: 'https://www.france.tv/france-2/direct.html',
  },
  {
    name: 'AUTO MOTO',
    url: 'https://www.automoto-lachaine.fr/Live-Replay',
  },
  {
    name: 'C8 Star +',
    url: 'https://www.canalplus.com/live/?channel=450',
  },
  {
    name: 'France 3',
    url: 'https://www.france.tv/france-3/direct.html',
  },
  {
    name: 'France 5',
    url: 'https://www.france.tv/france-5/direct.html',
  },
  {
    name: 'M 6',
    url: 'https://www.6play.fr/m6/direct',
  },
  {
    name: 'NRJ 12',
    url: 'https://www.nrj-play.fr/nrj12/direct',
  },
  {
    name: 'RMC2',
    url: 'https://rmcstory.bfmtv.com/mediaplayer-direct/',
  },
  {
    name: 'W96ter Puissance TNT',
    url: 'https://www.6play.fr/6ter/direct',
  },
];

const getChannelLink = channelName =>
  channels.find(channel => channel.name === channelName)?.url ||
  `https://www.google.com/search?q=chaine+%22${channelName}%22+en+direct`;

module.exports = { getChannelLink };
