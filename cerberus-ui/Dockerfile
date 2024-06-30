FROM node:alpine as builder

RUN npm install -g pnpm
RUN npm install -g vite
COPY . .

RUN pnpm install --link

ENV GENERATE_SOURCEMAP=false
RUN export NODE_OPTIONS="--max-old-space-size=4096" && pnpm run build

FROM nginx:alpine as final

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
