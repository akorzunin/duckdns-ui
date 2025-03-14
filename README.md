# duckdns-ui

Web ui for duckdns

## How to use

![Preview](image/README/1711285214839.png)

You can:

- Update ip manually
- Update ip w/ a periodic task
- View logs of tasks
- Restore/migrate periodic tasks

## Deploy

### From docker image

create `.env` and `compose.yaml` files

```
TOKEN={URDUCKDNSTOKEN}
```

```yaml
services:
  duckdns-ui:
    image: ghcr.io/akorzunin/duckdns-ui:latest
    ports:
      - 3000:3000
    env_file:
      - .env
    volumes:
      - ./data:/src/data:rw
    restart: unless-stopped
```

Run

    docker-compose up -d

### From git repo

    git clone ...
    cp .env.example .env
    # setup TOKEN
    docker-compose up -d --build

## .env variables

- TOKEN - DuckDNS token
- LOG_JSON - 0/1, default 1 write log in JSON format
- DRY_RUN - 0/1, default 0 dont send request to duckdns server and generate fake ip each update

## Dev

### Generate client from openapi specs

    pnpm dlx openapi-typescript-codegen@v0.29.0 --input ./docs/openapi.json --output ./web/src/api/client --client fetch

### Run vite dev sever w/ backend

    task debug-web

### Run api w/ hot reload

    air

### Run tests manually

    task test
