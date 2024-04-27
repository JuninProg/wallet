FROM node:18.18.1
RUN mkdir -p /app/auth-ms
WORKDIR /app/auth-ms
ADD . /app/auth-ms

RUN npm install

EXPOSE 3000

CMD npm run build && npm run start:prod
