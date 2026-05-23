# Progloss Backend

This folder contains the Progloss backend (Express + TypeScript + MongoDB).

Quick start (local):

1. Copy env and edit if needed:

```bash
cp .env.example .env
```

2. Start dependencies (optional):

```bash
docker-compose up -d mongo
```

3. Install and run in dev:

```bash
npm install
npm run db:seed
npm run dev
```

Run tests:

```bash
npm run test
```

Docker:

```bash
docker build -t progloss-backend .
docker-compose up -d
```

Environment variables are documented in `.env.example`.
