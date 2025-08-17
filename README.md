# Shop — NestJS E‑commerce Backend

A modular e‑commerce backend built with NestJS, TypeScript, Prisma, and PostgreSQL. The codebase is scaffolded for clean separation of concerns and ready for business logic implementation.

## Features

- Modular architecture: `Auth`, `Users`, `Products`, `Orders`, `Returns`, `Inventory`
- Prisma ORM with PostgreSQL
- JWT auth scaffolding with Passport
- Role-based access control scaffolding (`@Roles`, `RolesGuard`, `JwtAuthGuard`, `@Public`)
- Global validation, exception filter, logging and response transform interceptors
- Swagger/OpenAPI docs at `/docs`

## Tech Stack

- **Runtime**: Node.js, TypeScript
- **Framework**: NestJS 11
- **ORM**: Prisma
- **DB**: PostgreSQL
- **Validation**: class-validator / class-transformer
- **Auth**: @nestjs/passport, @nestjs/jwt, passport-jwt
- **Docs**: @nestjs/swagger

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL (local install or Docker Desktop)

Optional:

- Docker Desktop (to run Postgres via `docker compose`)

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Configure environment

Copy the example and adjust values as needed:

```bash
cp .env.example .env
```

Recommended `.env` values for local dev:

```bash
DATABASE_URL=postgresql://shop:shop@localhost:5432/shop?schema=public
PORT=3000
JWT_ACCESS_SECRET=change-me
```

3. Start PostgreSQL

- With Docker Desktop (optional):

```bash
npm run db:up
```

This starts Postgres 16 on port 5432 with db/user/password `shop`.

- Or use your local PostgreSQL and ensure the role/database exist:

```bash
# Create role and database (using default superuser)
psql -h localhost -p 5432 -U postgres -d postgres -c "CREATE ROLE shop LOGIN PASSWORD 'shop'" || true
createdb -h localhost -p 5432 -U postgres shop || true
psql -h localhost -p 5432 -U postgres -d postgres -c "ALTER DATABASE shop OWNER TO shop;"
```

4. Generate Prisma client and run migrations

```bash
npm run prisma:generate
npm run prisma:migrate:dev -- --name init
```

5. Run the app (watch mode)

```bash
npm run start:dev
```

6. Open Swagger UI

- Swagger UI: [http://localhost:3000/docs](http://localhost:3000/docs)
- API base URL: [http://localhost:3000](http://localhost:3000)

## NPM Scripts

- `start` — start app
- `start:dev` — start in watch mode
- `build` — compile TypeScript
- `lint` — run ESLint
- `test`, `test:e2e` — run tests
- `prisma:generate` — generate Prisma client
- `prisma:migrate:dev` — run Prisma development migrations
- `prisma:studio` — open Prisma Studio
- `db:up` — start Postgres via Docker Compose
- `db:down` — stop Postgres and remove volumes

## Project Layout

```
src/
├── common/
│   ├── decorators/ (roles, public)
│   ├── enums/ (role, order-status, return-status)
│   ├── filters/ (http-exception)
│   ├── guards/ (jwt-auth, roles)
│   └── interceptors/ (logging, response-transform)
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── dto/ (login, register, change-password, forgot-password)
│   └── strategies/ (jwt.strategy)
├── users/ (controller, service, module, dto)
├── products/ (controller, service, module, dto)
├── orders/ (controller, service, module, dto)
├── returns/ (controller, service, module, dto)
└── inventory/ (controller, service, module, dto)
```

## Database & Prisma

Prisma schema is defined in `prisma/schema.prisma` with the following models and enums:

- Models: `User`, `Product`, `Inventory`, `Order`, `OrderItem`, `Return`
- Enums: `Role`, `OrderStatus`, `ReturnStatus`

Migrations are managed with `prisma migrate dev`. The app uses `DATABASE_URL` from `.env` via `@nestjs/config`.

## Security & Auth (Scaffolded)

- JWT strategy via `passport-jwt`
- Guards: `JwtAuthGuard`, `RolesGuard`
- Decorators: `@Roles()`, `@Public()`
- Set your secrets in `.env`:

```bash
JWT_ACCESS_SECRET=change-me
```

## Conventions

- DTOs use class-validator decorators
- Controllers define method signatures and Swagger decorators, not business logic
- Services provide method signatures for CRUD and operations
- Global ValidationPipe, exception filter, and response transformer are enabled in `main.ts`

## Troubleshooting

- P1010: "User was denied access"
  - Fix your `DATABASE_URL` credentials, or create the role and grant access.

- P3014: "Could not create the shadow database"
  - Grant CREATEDB to your DB user:

  ```bash
  psql -h localhost -p 5432 -U postgres -d postgres -c "ALTER ROLE shop CREATEDB;"
  ```

- Swagger not reachable at `/docs`
  - Ensure the app is running and `PORT` matches your URL.

- Postgres not running
  - Start Docker: `npm run db:up` (requires Docker Desktop) or start your local Postgres service.

## License

UNLICENSED (private/internal use).
