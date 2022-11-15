# Production - worker will wait for an insert event; Then use the new index value and cal fib sequence
# Base image will be node (npm installed)
FROM node:16-alpine

# Working directory
WORKDIR /app 

# Dependencies + install
COPY ./package.json ./
RUN npm install 

# COPY rest of the files
COPY ./ ./

# Startup command
CMD ["npm", "run", "start"]