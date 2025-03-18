FROM node:22-alpine
WORKDIR /usr/code
COPY ./package.json .
RUN apk add g++ make python3 linux-headers
RUN apk add --update py3-pip
RUN npm install
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.2/zsh-in-docker.sh)"
# ENTRYPOINT ["tail", "-f", "/dev/null"]
CMD [ "node", "server2.js" ]