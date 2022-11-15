# Production use
# Express server that's used to route request to either Redis or Postgres
# Base image will be node for NPM and node (alpine)
FROM node:16-alpine

# Working directory - so not to overwrite any of the existing files on root
WORKDIR /app

# Copy over package file for dependencies
COPY ./package.json ./
# Install the packages
RUN npm install 

# Copy over the rest of the files
COPY ./ ./

# Start up command
CMD ["npm", "run", "start"]