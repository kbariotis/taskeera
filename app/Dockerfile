FROM node:12 as node

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=3000
ENV PORT $PORT

RUN mkdir /opt/node_app && chown node:node /opt/node_app
WORKDIR /opt/node_app

USER node
COPY package.json ./
COPY yarn.lock ./

RUN yarn --frozen-lockfile

WORKDIR /opt/node_app/app
COPY . .

CMD [ "yarn", "build" ]

FROM nginx as server

EXPOSE 80
COPY --from=node /usr/src/app/public /usr/share/nginx/html
