FROM node:18.18.1
RUN mkdir -p /app/gateway-ms
WORKDIR /app/gateway-ms
ADD . /app/gateway-ms

RUN npm install

EXPOSE 3000

CMD npm run build && npm run start:prod
