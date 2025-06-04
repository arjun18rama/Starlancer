# -------- Stage 1: Install dependencies ---------
FROM node:bookworm-slim AS build
WORKDIR /app

# Copy dependency descriptors and install only production packages
COPY package.json package-lock.json ./
RUN npm ci --only=production

# -------- Stage 2: Create lightweight runtime image ---------
FROM node:alpine
ENV NODE_ENV=production
WORKDIR /app

# Copy installed modules and application code
COPY --from=build /app/node_modules ./node_modules
COPY . .

# Start the application
CMD ["npm", "start"]
