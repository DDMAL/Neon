FROM node:18-alpine AS builder
RUN apk add --no-cache git
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build:prod

FROM nginx:1.25-alpine
RUN sed -i 's/worker_processes  auto;/worker_processes  2;/' /etc/nginx/nginx.conf
COPY --from=builder /app/deployment/server /usr/share/nginx/html
COPY k8s/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
