FROM node:15.4.0-alpine3.10
# ARG env=aws
ARG port=4030

ENV NODE_ENV=${env}
WORKDIR /home/app
COPY --chown=node:node package.json .

# Download the phantomjs for docker and add support for the fonts
# Add support for https on wget
RUN apk update && apk add --no-cache wget && apk --no-cache add openssl wget && apk add ca-certificates && update-ca-certificates

# Add phantomjs
RUN wget -qO- "https://github.com/dustinblackman/phantomized/releases/download/2.1.1a/dockerized-phantomjs.tar.gz" | tar xz -C / \
    && npm config set user 0 \
    && npm install -g phantomjs-prebuilt

# Add fonts required by phantomjs to render html correctly
RUN apk add --update ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family && rm -rf /var/cache/apk/*

RUN npm install --production
COPY --chown=node:node . .
RUN rm ./.env
RUN cp ./.env.${env} ./.env
# RUN cp -R ./.aws /root/.aws

EXPOSE ${port}
CMD [ "npm", "start" ]
