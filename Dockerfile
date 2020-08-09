FROM telkomindonesia/alpine:nodejs-12

WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --update --no-cache --virtual .build-dev build-base python python-dev \
    && npm i -g npm \
    && npm i -g node-gyp \
    && npm i --build-from-source=bcrypt\
    && apk del .build-dev
COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
