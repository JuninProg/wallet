FROM node:18.18.1
RUN mkdir -p /app/auth-ms
WORKDIR /app/auth-ms
ADD . /app/auth-ms

RUN npm install

RUN npx prisma generate
RUN npx prisma migrate deploy --schema prisma/schema.prisma

EXPOSE 5001

CMD npm run build && npm run start:prod
