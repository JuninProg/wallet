FROM node:18.18.1
RUN mkdir -p /app/transaction-ms
WORKDIR /app/transaction-ms
ADD . /app/transaction-ms

RUN npm install

RUN npx prisma generate

EXPOSE 5002

CMD npm run migrate:db && npm run build && npm run start:prod
