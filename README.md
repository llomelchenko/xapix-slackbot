# Xapix Slackbot

_A Slackbot that uses the xapix api_.


This Slackbot that receives input through a [slash command](https://api.slack.com/slash-commands) and sends a request to a xapix API.

This project is initally based on a great demo project from Medium: [https://goo.gl/wDyayI](https://goo.gl/wDsyayI)

## Installation

Clone the repo and then install dependencies:

    git clone https://github.com/llomelchenko/xapix-slackbot.git
    cd xapix-slackbot
    yarn install


Setup the server (I used Heroku):

    heroku create my-slackbot


Set Heroku environment variable for [Xapix access token](https://xapix.io):

    heroku config:add AUTH_KEY=[your Xapix auth token]
    git push heroku master


Setup Slack slash command:

* Goto `http://[your-slack-team].slack.com/apps/manage/custom-integrations` and add a slash command.
* Fill in the fields:
  * _Command_: the name of your slash command (ex: `/xapix-bot`)
  * _URL_: The URL to request when the slash command is run (ex: `https://my-slackbot.herokuapp.com/post`)
  * _Method_: POST
  * _Customize Name_: The name of your Slackbot
  * _Customize Icon_: A custom icon or an emoji
  * _Autocomplete help text_: Helps users when they start typing `/`
  * _Descriptive Label_: Provides extra context


## Usage

In Slack, send slash commands to /xapix-bot:

    /xapix-bot JFK


## License

The MIT License (MIT)
Copyright (c) 2016 Lauren Omelchenko

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
