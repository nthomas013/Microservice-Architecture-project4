FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/ \
 && npm install --omit=dev

COPY src ./src

CMD ["node", "src/index.js"]
