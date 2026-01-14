FROM denoland/deno:2.6.4

ENV TZ=UTC
ENV PORT=8370

EXPOSE 8370

WORKDIR /app

COPY api/ ./api/
COPY modules/ ./modules/
COPY platform/ ./platform/
COPY .npmrc .
COPY deno.json ./deno.json

RUN deno install --allow-scripts

CMD ["sh", "-c", "deno run --allow-all ./api/.tasks/migrate.ts && deno run --allow-all ./api/server.ts"]
