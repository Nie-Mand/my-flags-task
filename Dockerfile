FROM node:current-alpine3.15

WORKDIR /app

ARG FLAG

ENV FLAG ${FLAG}

COPY . .

RUN npm ci

RUN node init.js

CMD ["node", "app.js"]