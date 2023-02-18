FROM node

WORKDIR /build/server
COPY server/package.json /build/server
RUN npm i
COPY ./server /build/server

WORKDIR /build/client
COPY client/package.json /build/client
RUN npm i
COPY ./client /build/client

EXPOSE 3001

CMD ["npm", "run", "dev", "npm", "start"]