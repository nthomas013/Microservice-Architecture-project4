FROM node:20-slim

WORKDIR /app

# Fix Debian repo protocol
RUN sed -i 's|http://deb.debian.org|https://deb.debian.org|g' \
    /etc/apt/sources.list.d/debian.sources

RUN npm config set registry http://192.168.1.43:8081/repository/npm-group/ \
 && npm config set strict-ssl false \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000

# Install deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy source
COPY src ./src

CMD ["node", "src/index.js"]
