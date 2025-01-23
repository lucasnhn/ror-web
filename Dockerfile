ARG GCR_MIRROR=gcr.io/
FROM ${GCR_MIRROR}distroless/nodejs22-debian12
LABEL org.opencontainers.image.source https://github.com/norskhelsenett/ror
WORKDIR /app

COPY node_modules /app/node_modules
COPY build /app/build
CMD ["node_modules/.bin/react-router-serve", "./build/server/index.js"]
