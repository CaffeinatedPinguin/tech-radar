# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=26-alpine

FROM node:${NODE_VERSION} AS build
WORKDIR /app
RUN npm i -g corepack && corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN corepack pnpm build

FROM scratch AS prebuilt
COPY dist /dist

FROM nginx:alpine AS runtime-prebuild
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=prebuilt /dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

FROM nginx:alpine AS runtime
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
