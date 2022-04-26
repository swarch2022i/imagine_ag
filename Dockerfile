FROM node:carbon-slim

# Create app directory
WORKDIR /swarch2022i_ag

# Install app dependencies
COPY package.json /swarch2022i_ag/
RUN npm install

# Bundle app source
COPY . /swarch2022i_ag/
RUN npm run prepublish

CMD [ "npm", "run", "runServer" ]
