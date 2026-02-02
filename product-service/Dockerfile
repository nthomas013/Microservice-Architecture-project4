FROM node:20-slim

WORKDIR /app

RUN sed -i 's|http://deb.debian.org|https://deb.debian.org|g' \
    /etc/apt/sources.list.d/debian.sources

RUN npm config set registry http://192.169.1.43:8081/repository/npm-group/ \
 && npm config set strict-ssl false

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src
CMD ["node", "src/index.js"]
