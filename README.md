# Slackbot: As Seen On Television

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Prerequisites

Be sure [Node](https://nodejs.org/) and [NPM](https://www.npmjs.com/) are installed.

I use [Yarn](https://classic.yarnpkg.com/), but you could use NPM instead.

For local development, you'll need to expose the local server to the internet. You can use [Ngrok](https://ngrok.com/docs): [download it](https://ngrok.com/download) or install it with brew by running `brew install --cask ngrok`.

### Configuration

1. Create an app on [Slack API](https://api.slack.com/apps/)

2. Configure the app token:
   - In `OAuth & Permissions` menu, add the app to your workspace.
   - Create a token with `chat:write` and `users:read` permissions.
   - Save your bot user access token and the signing secret token from `basic information`.

3. Subscribe to events: in the `Event Subscriptions`, toggle `Enable Events`.

## Installation

1. Clone the project

```shell
git clone git@github.com:proustibat/slack-asot.git
cd slack-asot
```

2. Set environment variables as follows:

```shell
export SLACK_BOT_TOKEN=<your-slack-bot-token>
export SLACK_SIGNING_SECRET=<your-slack-signing-secret>
```

You can also add the port number of the app: `export APP_PORT=8080`.

3. Then install packages:

```shell
yarn
```

I recommend to use [direnv](https://direnv.net/) in your repo to unclutter your `~/.profile` and load environment variables properly for each project.

## Development

### Configure Database
We gonna use Firebase Realtime Database(https://firebase.google.com/docs/database). So, create an [app](https://console.firebase.google.com/).
Create 2 real time databases: 
- `slack-asot-ads-dev`: contains the ads data, exported from an internal Google Spreadsheet or Excel file. We export this file in CS format, then use [CSV JSON](https://csvjson.com/csv2json) to convert it into a JSON file that can be imported in Firebase.
- `slack-asot-users-dev`: gonna save users and their settings
Obviously, the `-dev` suffixes are here because we uses development database in local. But be sure to create fresh databases on production.
  
The app uses environment variables, so define them:
```
export DATABASE_ID_USERS=slack-asot-users-dev
export DATABASE_ID_ADS=slack-asot-ads-dev
```

You also need the Administrative privileges to access the databases, the app imports the certificate at `/.serviceAccountKey.json`. Follow these [instructions](https://developers.google.com/identity/protocols/oauth2/service-account?authuser=0).

### Local server

```shell
yarn start
```

### Configure Ngrok Proxy

```shell
yarn ngrok
```

1. Under the `Event Subscriptions` tab of the menu, switch `Enable Events` and in the `Request URL` box, go ahead and paste in the url as follows: 
`https://your-own-generated-url.ngrok.io/slack/events>`. As long as your Bolt app is still running, your URL should become verified.


2. After your request URL is verified, scroll down to `Subscribe to Bot Events`: choose all four message events (`message.channels`, `message.mpim`, `message.im`, `message.groups`).
This step is only for the first time.

3. Go into `Interactivity & Shortcuts` menu, paste the same request url.

Then you won't touch the Ngrok proxy again except if you stop the ngrok server. The steps 1, and 3 should be done again if you restart the server and get a new proxy url.

## Useful links

- [Slack documentation: Getting started with Bolt for JavaScript](https://slack.dev/bolt-js/tutorial/getting-started)
- [Slack documentation: Using OAuth 2.0](https://api.slack.com/legacy/oauth)
- [Using ngrok to develop locally for Slack](https://api.slack.com/tutorials/tunneling-with-ngrok)
- [Block Kit Builder](https://app.slack.com/block-kit-builder)
- [Commitizen](http://commitizen.github.io/cz-cli/) / [cz-emoji](https://github.com/ngryman/cz-emoji)
- [Husky](https://github.com/typicode/husky#readme)
- [Prettier](https://prettier.io/) / [pretty-quick](https://github.com/azz/pretty-quick#readme)
- [Introduction to the Admin Database API](https://firebase.google.com/docs/database/admin/start)
