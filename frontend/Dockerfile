FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Set to '' (empty) for server deploy so the frontend makes same-origin calls
# and nginx proxies /api -> backend:1337.
# Set to http://localhost:1337 for local dev without Docker.
ARG VITE_STRAPI_URL=
ENV VITE_STRAPI_URL=${VITE_STRAPI_URL}

RUN npm run build

FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
