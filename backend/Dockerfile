FROM node:22.17.0-alpine

WORKDIR /app

# Install dependencies only once
COPY package.json package-lock.json ./
RUN npm install

# Dev mode: run TS directly
CMD ["npm", "run", "dev"]
