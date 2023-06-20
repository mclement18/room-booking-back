FROM node:18-alpine as builder

RUN apk add --no-cache git openssh

USER 1000

ENV NODE_ENV build

RUN mkdir -p /home/node/app

COPY --chown=1000:1000 yarn.lock package.json tsconfig.json tsconfig.build.json nest-cli.json /home/node/app/
COPY --chown=1000:1000 src/ /home/node/app/src

WORKDIR /home/node/app/

RUN yarn --frozen-lockfile && \
   yarn build

FROM node:18-alpine

RUN apk add --virtual build-dependencies git openssh && \
   mkdir -p /app/node_modules && \
   chown -R 1000:1000 /app

RUN apk add bash
RUN apk add --update --no-cache bind-tools

COPY --chown=1000:1000 --from=builder /home/node/app/package.json /app/
COPY --chown=1000:1000 --from=builder /home/node/app/yarn.lock /app/
COPY --chown=1000:1000 --from=builder /home/node/app/dist/ /app/dist/

USER 1000

WORKDIR /app/

ENV NODE_ENV production

RUN yarn --frozen-lockfile

USER 0

RUN apk del build-dependencies

USER 1000

CMD ["yarn", "start:prod"]
