ARG GCR_MIRROR=gcr.io/
FROM ${GCR_MIRROR}distroless/nodejs22-debian12
LABEL org.opencontainers.image.source https://github.com/norskhelsenett/ror
WORKDIR /app

COPY build/server /app
CMD [ "/app/index.js" ]