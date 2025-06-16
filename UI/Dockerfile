# Stage 1: Build the Angular app
FROM node:lts-alpine AS builder
WORKDIR /ang2

# Increase memory for Node.js to prevent build failures
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Copy package.json and package-lock.json separately to leverage Docker caching
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build Angular app with production settings
RUN npm run build -- --configuration=production --output-path=dist/building-reality

# Reduce image size by cleaning up unnecessary files
RUN rm -rf node_modules \
    && rm -rf /ang2/.angular/cache

# Stage 2: Serve the Angular app with NGINX
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy built Angular app from builder stage
COPY --from=builder /ang2/dist/building-reality . 

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start NGINX
ENTRYPOINT ["nginx", "-g", "daemon off;"]
