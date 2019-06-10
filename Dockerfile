FROM node:10 as dev 

ENV PORT 8080

EXPOSE ${PORT}

WORKDIR /db/server

ENV NODE_ENV=development

COPY package.json yarn.lock ./

RUN yarn

COPY . .

CMD [ "yarn", "watch" ]