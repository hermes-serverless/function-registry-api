# ================ COMMON ================

FROM node:11 as common

ENV PORT 8080

EXPOSE ${PORT}

WORKDIR /db/server

COPY package.json yarn.lock ./

# ================ DEVELOPMENT ================

FROM common as development

ENV NODE_ENV=development

RUN yarn && yarn cache clean

COPY . .

RUN yarn tsc

CMD [ "yarn", "start:dev" ]

# ================ MIGRATOR ================

FROM common as migrator

RUN yarn && yarn cache clean

COPY . .

# ================ PRODUCTION ================

FROM common as production 

ENV NODE_ENV=production

RUN yarn --production && \
  yarn autoclean --init && \
  echo *.ts >> .yarnclean && \
  echo *.ts.map >> .yarnclean && \
  echo *.spec.* >> .yarnclean && \
  yarn autoclean --force && \
  yarn cache clean


COPY --from=development /db/server/build .

CMD [ "yarn", "start:prod" ]