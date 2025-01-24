ARG GCR_MIRROR=gcr.io/
FROM ${GCR_MIRROR}distroless/nodejs22-debian12
LABEL org.opencontainers.image.source https://github.com/norskhelsenett/ror
WORKDIR /app

COPY public ./public
COPY .next/standalone ./
COPY .next/static ./.next/static

CMD ["/app/server.js"]
