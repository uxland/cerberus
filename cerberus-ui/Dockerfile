FROM node:20 as builder
WORKDIR /src
RUN npm install -g pnpm
COPY . /src

RUN pnpm install --link --frozen-lockfile

RUN pnpm run build

FROM nginx:alpine as final

COPY --from=builder /src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
