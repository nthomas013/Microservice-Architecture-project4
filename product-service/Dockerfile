FROM node:20-slim

WORKDIR /app

RUN sed -i 's|http://deb.debian.org|https://deb.debian.org|g' \
    /etc/apt/sources.list.d/debian.sources

COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/ \
 && npm install --omit=dev

COPY src ./src

CMD ["node", "src/index.js"]
