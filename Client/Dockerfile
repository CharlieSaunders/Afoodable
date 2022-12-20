### STAGE 1: Build ###
FROM node:19.3-alpine AS build
WORKDIR /usr/src/app
COPY ./Client/package.json package-lock.json ./
RUN npm install --force
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.22.1-alpine
COPY ./Client/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/afoodable /usr/share/nginx/html