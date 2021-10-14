FROM node:14-slim
WORKDIR /home/node
COPY dist/ dist/
COPY test/sampleFiles/ test/sampleFiles
COPY package.json .
RUN npm install --only=production