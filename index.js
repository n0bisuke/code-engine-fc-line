'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const port = process.env.PORT || 3001;

// create LINE SDK config from env variables
const config = {

};

// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create an echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [echo],
  });
}

// listen on port
app.listen(port, () => console.log(`listening on ${port}`));