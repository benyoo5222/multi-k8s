# Production - React frontend; Using nginx as the service that will serve up static build files
# Two phases; First will be to create the production build files
# Base image will be node but we will give it a name for the phase
FROM node:16-alpine as builder

WORKDIR /app

COPY ./package.json ./
RUN npm install 

COPY ./ ./

RUN npm run build 

# Phase 2; We take the last image from the previous phase and we copy it into nginx
FROM nginx

EXPOSE 3000

COPY ./nginx/default.conf ./etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html