FROM node:alpine

# set working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install the application dependencies
RUN npm install

# copy the rest of the application code
COPY . .

# expose the port 3000 just for the documentation purpose
EXPOSE 3000

# start the application
CMD ["node", "server.js"]