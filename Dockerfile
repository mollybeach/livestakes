FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies including build tools for native modules
# Split into separate RUN commands for better caching
RUN apk add --no-cache libc6-compat supervisor nginx curl
RUN apk add --no-cache python3 make g++ gcc linux-headers

# Create user/group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy and install frontend dependencies (cached layer)
COPY src/package.json ./package.json
# Note: Frontend doesn't have package-lock.json, so we use npm install
RUN npm install && npm cache clean --force

# Copy and install backend dependencies (cached layer)
WORKDIR /app/server
COPY src/server/package.json ./package.json
COPY src/server/package-lock.json ./package-lock.json
# Server has package-lock.json, so we can use npm ci for deterministic installs
RUN npm ci && npm cache clean --force

# Copy all frontend source files
WORKDIR /app
COPY src/app ./app
COPY src/public ./public
COPY src/next.config.js ./next.config.js
COPY src/tailwind.config.js ./tailwind.config.js
COPY src/postcss.config.js ./postcss.config.js
COPY src/next-env.d.ts ./next-env.d.ts
COPY src/tsconfig.json ./tsconfig.json
COPY src/.env* ./

# Copy blockchain artifacts (required for contractsApi.ts imports)
COPY src/blockchain/artifacts ./blockchain/artifacts

# Copy all server source files
WORKDIR /app/server
COPY src/server/src ./src
COPY src/server/tsconfig.json ./tsconfig.json
COPY src/server/.env* ./

# Build applications
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

WORKDIR /app/server
RUN npm run build

# Copy config files
WORKDIR /app
COPY common/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY common/ecosystem.config.js /app/ecosystem.config.js
COPY common/nginx.conf /etc/nginx/nginx.conf

# Create necessary directories for nginx
RUN mkdir -p /run/nginx && \
    mkdir -p /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chown -R nextjs:nodejs /run/nginx /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp

# Install global tools
RUN npm install -g next pm2

# Set proper permissions for Next.js directory
RUN chown -R nextjs:nodejs ./.next
RUN chown -R nextjs:nodejs ./public
RUN chown -R nextjs:nodejs ./node_modules

# Expose ports
EXPOSE 3000 3334 80

# Set hostname and host for Next.js to bind to all interfaces
ENV HOSTNAME=0.0.0.0
ENV HOST=0.0.0.0

# Run supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

HEALTHCHECK --interval=15m --timeout=5s --retries=3 \
    CMD ["/usr/bin/curl", "--fail", "http://localhost:8080/health"]