FROM node:19
WORKDIR /usr/src/app
COPY ./Server/package.json ./
RUN npm install
COPY . .
RUN cd ./Server
EXPOSE 9998
CMD [ "node", "Server/server.js" ]