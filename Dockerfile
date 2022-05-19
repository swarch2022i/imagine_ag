FROM node:carbon-slim

# Create app directory
WORKDIR /image_ag

# Install app dependencies
COPY package.json /image_ag/
RUN npm install

# Bundle app source
COPY . /image_ag/
RUN npm run prepublish

EXPOSE 5000

CMD [ "npm", "run", "runServer" ]
