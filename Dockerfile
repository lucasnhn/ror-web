ARG GCR_MIRROR=gcr.io/
FROM ${GCR_MIRROR}distroless/nodejs22-debian12
LABEL org.opencontainers.image.source https://github.com/norskhelsenett/ror
WORKDIR /app

COPY apps/web/public ./public
COPY apps/web/.next/standalone ./
COPY apps/web/.next/static ./.next/static

CMD ["/app/apps/web/server.js"]
