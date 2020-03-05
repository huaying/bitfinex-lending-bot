FROM node:13.8.0-alpine
LABEL maintainer="royal3501@gmail.com"

RUN mkdir /app
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 5000
CMD ["yarn", "server"]