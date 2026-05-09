FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies using the lockfile for deterministic, reproducible builds.
# --ci is the production-safe equivalent of npm install:
#   - Fails if package-lock.json is out of sync with package.json
#   - Never modifies node_modules unexpectedly
#   - Faster than npm install in CI/CD pipelines
RUN npm ci

# Now copy the rest of the source code into the container.
# Done AFTER npm ci so that changes to your source code don't
# invalidate the npm install cache layer above.
COPY . .

# Run the Vite production build command.
# This compiles React JSX → JavaScript, bundles with tree-shaking,
# minifies CSS and JS, and outputs everything to the /app/dist folder.
# Result: /app/dist contains index.html + optimized static assets.
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — "production"
# Purpose: Serve the compiled static files using Nginx.
# This stage starts from a FRESH, minimal Nginx image — no Node.js,
# no npm, no source code, no node_modules. Final image is ~25MB.
# ─────────────────────────────────────────────────────────────────────────────

# nginx:alpine is the industry-standard base for serving React apps in production.
# It is ~23MB, includes a battle-tested HTTP server, and has no Node.js at all.
FROM nginx:1.25-alpine AS production

# Remove the default Nginx welcome page config so our custom config takes over.
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx configuration into the container.
# This config handles: SPA routing (fallback to index.html for React Router),
# gzip compression, cache headers, and proxying /api calls to the backend.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy ONLY the compiled build output from the "builder" stage above.
# --from=builder tells Docker to read from Stage 1, not the current filesystem.
# /app/dist is where Vite outputs the built React app.
# /usr/share/nginx/html is where Nginx serves static files from by default.
COPY --from=builder /app/dist /usr/share/nginx/html

# Inform Docker (and humans) that this container listens on port 9500.
# EXPOSE is documentation only — it does not actually publish the port.
# You still need -p 9500:9500 in docker run or ports: in docker-compose.yml.
EXPOSE 9500

# Run Nginx in the foreground (daemon off).
# Containers require a foreground process — if the main process exits, the container stops.
# "daemon off" prevents Nginx from forking into the background and immediately exiting.
# Using exec form ["..."] instead of shell form "..." ensures SIGTERM is sent
# directly to nginx, not to a shell wrapper — critical for graceful shutdown in Kubernetes.
CMD ["nginx", "-g", "daemon off;"]
