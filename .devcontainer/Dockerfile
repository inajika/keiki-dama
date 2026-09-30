FROM node:24-slim

ENV TZ=UTC C.LANG=UTF-8

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    sudo \
    vim \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN echo "node ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER node
ENV HOME=/home/node

WORKDIR /develop/keiki-dama

EXPOSE 3000
