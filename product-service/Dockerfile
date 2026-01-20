FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

COPY src ./src

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
