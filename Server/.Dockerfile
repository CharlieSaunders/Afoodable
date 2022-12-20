FROM node:19

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 9998
CMD [ "node", "server.js" ]