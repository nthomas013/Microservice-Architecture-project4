FROM node:20-slim

WORKDIR /app

# Fix Debian repos
RUN sed -i 's|http://deb.debian.org|https://deb.debian.org|g' \
    /etc/apt/sources.list.d/debian.sources

# Make npm resilient in CI / Jenkins / Docker
RUN npm config set registry https://registry.npmjs.org/ \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm config set network-timeout 600000

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
CMD ["npm", "start"]
