FROM node:22.17.0-alpine

WORKDIR /app

# Install dependencies only
COPY package.json package-lock.json ./
RUN npm install

# Dev mode: run Vite
CMD ["npm", "run", "dev"]
