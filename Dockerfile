
FROM node:16

# ARG NPM_TOKEN

# Create app directory
WORKDIR /usr/src/frontend

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json *.lock ./

# RUN npm i -g zx
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
# Boundle app source
COPY . .
# map port to Docker daemon
EXPOSE 80
CMD [ "node", "bergamot-httpserver.js", "80", "1", "0" ]