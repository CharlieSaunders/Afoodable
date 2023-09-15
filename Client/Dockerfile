### STAGE 1: Build ###
FROM node:18-alpine AS build
WORKDIR /usr/src/app
COPY ["./", "./"]
RUN npm install --omit-dev
RUN npm install -g @angular/cli
RUN ng build --c prod

### STAGE 2: Run ###
FROM nginx:1.23.3-alpine
COPY ["./Client/nginx.conf", "/etc/nginx/nginx.conf"]
COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html
