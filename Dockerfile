FROM denoland/deno:2.5.1

ENV TZ=UTC
ENV PORT=8370

EXPOSE 8370

WORKDIR /app

COPY api/ ./api/
COPY relay/ ./relay/
COPY .npmrc .
COPY deno-docker.json ./deno.json

RUN deno install --allow-scripts

CMD ["sh", "-c", "deno run --allow-all ./api/.tasks/migrate.ts && deno run --allow-all ./api/server.ts"]