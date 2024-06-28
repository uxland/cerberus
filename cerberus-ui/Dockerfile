FROM node:alpine as builder

RUN npm install -g pnpm
RUN npm install -g vite
WORKDIR /app
COPY . .

RUN pnpm install --link


RUN pnpm run build

FROM nginx:alpine as final

COPY --from=builder /app/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
