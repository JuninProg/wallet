FROM node:18.18.1
RUN mkdir -p /app/relatory-ms
WORKDIR /app/relatory-ms
ADD . /app/relatory-ms

RUN npm install

RUN npx prisma generate

EXPOSE 5003

CMD npm run migrate:db && npm run build && npm run start:prod
