# duckdns-ui

Web ui for duckdns

## Generate client from openapi specs

npx openapi-typescript-codegen --input ./docs/openapi.json --output ./web/src/api/client --client fetch
