# Bitfinex Lending Bot
The project is written in React (create-react-app) and nodejs (expressjs).

<img width="1029" alt="Screen Shot 2020-03-14 at 8 51 21 PM" src="https://user-images.githubusercontent.com/3991678/76682282-affb4000-6635-11ea-9f79-f485e31e69e2.png">


## Prerequisite
yarn, docker, docker-compose

## Installation
- Create a new file `.env` under the current directory and put your key, secret and timezone here.
```
API_KEY=xxx
API_SECRET=xxx

TZ=Asia/Taipei
```

- Copy `server/custom-config.example.js` to `server/custom-config.js`, we can playground with the numbers in this config.

- Run `yarn` to install required packages

## Run the bot
If you just want to start the bot and automatically lend your money out, you only need to start the backend service.
It will check your remaining/submit funding offers every <b>3</b> minutes.

```
docker-compose up 
```

## Run the auto submit once
Although the bot checks and submits offers regularly, you can run the script directly.

```
yarn auto-submit
```

## Start the ui (optional)

```
yarn start
```

### Deploy to your own server:

api: `docker-compose up -d` and serve it in a proxy server such as nginx

ui:  `REACT_APP_API_URL='https://yourserverurl.com' yarn build` 


