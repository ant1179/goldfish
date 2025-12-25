FROM node:20 AS builder

WORKDIR /app

# Create a non root user
ARG UID=1001
ARG GID=1001

RUN groupadd --gid "${GID}" appuser \
    && useradd --home /home/appuser --uid "${UID}" --gid "${GID}" appuser \
    && chown appuser:appuser -R /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx

# Create a non root user
ARG UID=1001
ARG GID=1001

RUN groupadd --gid "${GID}" appuser \
    && useradd --home /home/appuser --uid "${UID}" --gid "${GID}" appuser

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configurations
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-nonroot.conf /etc/nginx/nginx.conf

# Create necessary directories and set permissions for non-root user
RUN mkdir -p /var/cache/nginx/client_temp \
    && mkdir -p /var/cache/nginx/proxy_temp \
    && mkdir -p /var/cache/nginx/fastcgi_temp \
    && mkdir -p /var/cache/nginx/uwsgi_temp \
    && mkdir -p /var/cache/nginx/scgi_temp \
    && mkdir -p /var/run/nginx \
    && chown -R appuser:appuser /var/cache/nginx \
    && chown -R appuser:appuser /usr/share/nginx/html \
    && chown -R appuser:appuser /var/log/nginx \
    && chown -R appuser:appuser /var/run/nginx \
    && chown -R appuser:appuser /etc/nginx/conf.d \
    && chown appuser:appuser /etc/nginx/nginx.conf

EXPOSE 8080

# Run nginx as non-root user
USER appuser

CMD ["nginx", "-g", "daemon off;"]

