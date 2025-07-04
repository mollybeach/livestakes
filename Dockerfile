FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
RUN apk add --no-cache libc6-compat supervisor nginx curl

# Create user/group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy frontend files
COPY src/package.json ./package.json
COPY src/package-lock.json* ./
RUN npm install

# Copy backend files
WORKDIR /app/server
COPY src/server/package.json ./package.json
COPY src/server/package-lock.json* ./
RUN npm install

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

# Copy all server source files
WORKDIR /app/server
COPY src/server/src ./src
COPY src/server/tsconfig.json ./tsconfig.json
COPY src/server/.env* ./

# Build
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