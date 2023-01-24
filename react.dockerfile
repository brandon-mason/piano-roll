FROM node

WORKDIR /build/client
COPY client/package.json /build/client
RUN npm i
COPY ./client /build/client
# COPY ./client/src /build/client/src
# COPY ./client/dist /build/client/src

EXPOSE 3001

CMD ["npm", "start"]