FROM node:18-alpine
WORKDIR /app
COPY ["./Server/package.json", "./"]
RUN npm install --omit=dev
COPY ./Server .
CMD [ "npm", "run", "start-prod" ]