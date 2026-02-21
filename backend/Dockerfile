# -------- Stage 1: Build --------
FROM node:22.17.0-alpine AS builder

WORKDIR /app

#same version for local and docker
RUN npm install -g npm@11.10.1

# Copy dependency files first for better caching
COPY package.json package-lock.json ./


# Install all deps (including dev tools) for building
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript -> dist
RUN npm run build


# -------- Stage 2: Production --------
FROM node:22.17.0-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g npm@11.10.1

# Copy dependency files again
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled JS from builder stage
COPY --from=builder /app/dist ./dist

# If you have any other runtime assets, copy them too:
# COPY --from=builder /app/public ./public

EXPOSE 5000

CMD ["node", "dist/server.js"]