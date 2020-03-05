# bitfinex-lending-bot

## Prerequisite
yarn, docker, docker-compose

## Installation
- Create a new file `.env` under the current directory and put your key and secret here.
```
API_KEY=xxx
API_SECRET=xxx
```

- Run `yarn` to install required packages

## Run the script to submit offer automatically
`yarn auto-submit`

## Run the script to sync your recent earning history to db
`yarn sync-earning`

## Run the web app
### Run it locally:

api: `docker-compose up`

ui: `yarn start`

### Deploy to your own server:

api: `docker-compose up -d` and use proxy server such as nginx

ui:  `REACT_APP_API_URL='https://yourserverurl.com' yarn build`


