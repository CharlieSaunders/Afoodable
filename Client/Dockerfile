### STAGE 1: Build ###
FROM node:18.12.1-alpine AS build
WORKDIR /usr/src/app
COPY ./Client ./
RUN npm install --force
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.22.1-alpine
COPY ./Client/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html