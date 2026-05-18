# ERP Core Backend

Enterprise ERP Backend using:

- NestJS
- PostgreSQL
- MikroORM
- Swagger
- Redis
- BullMQ

---

# Why This Project?

This project is being built for:

- Accounting
- Inventory
- GST
- Sales
- Purchase
- Multi-Tenant SaaS ERP

The architecture is designed for:

- scalability
- clean backend structure
- enterprise-level coding
- modular development

---

# Tech Stack

| Technology  | Purpose                   |
| ----------- | ------------------------- |
| NestJS      | Backend framework         |
| PostgreSQL  | Main database             |
| MikroORM    | ORM for database handling |
| Swagger     | API documentation         |
| Redis       | Cache & queue support     |
| BullMQ      | Background jobs           |
| Docker      | Containerized development |
| ESLint      | Code quality              |
| Prettier    | Code formatting           |
| Husky       | Git hooks                 |
| lint-staged | Format only changed files |
| Commitlint  | Standard commit messages  |

---

# Project Setup

# 1. Create NestJS Project

Install Nest CLI:

```bash
npm install -g @nestjs/cli
```

Create project:

```bash
nest new erp-core
```

---

# 2. Install Prettier

## Why?

Prettier automatically formats code.

Example:

- fixes spacing
- semicolons
- indentation
- quotes

Install:

```bash
npm install -D prettier
```

Create `.prettierrc`

```json
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all"
}
```

Create `.prettierignore`

```txt
dist
node_modules
coverage
```

---

# 3. ESLint

## Why?

ESLint detects:

- code mistakes
- bad practices
- unused variables
- async issues

NestJS already includes ESLint.

Run:

```bash
npm run lint
```

---

# 4. Husky

## Why?

Husky runs checks before git commit.

Example:

```txt
git commit
→ prettier
→ eslint
→ tests
```

Install:

```bash
npm install -D husky
```

Initialize:

```bash
npx husky init
```

---

# 5. lint-staged

## Why?

Runs formatting only on changed files.

Without it:

- whole project gets linted

With it:

- only changed files

Install:

```bash
npm install -D lint-staged
```

Add in `package.json`

```json
"lint-staged": {
  "*.{js,ts}": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

Edit:

`.husky/pre-commit`

```bash
npx lint-staged
```

---

# 6. Commitlint

## Why?

For clean git commit history.

Good example:

```txt
feat: add voucher module
fix: correct gst calculation
```

Bad example:

```txt
asdfasdf
```

Install:

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

Create:

`commitlint.config.js`

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

Add hook:

```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit $1'
```

---

# 7. Environment Configuration

## Why?

To store:

- database credentials
- JWT secrets
- API keys
- Redis config

Install:

```bash
npm install @nestjs/config
```

Create `.env`

```env
PORT=5000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=erp_core
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
```

Update `app.module.ts`

```ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

---

# 8. PostgreSQL Setup

## Why PostgreSQL?

ERP systems require:

- transactions
- joins
- consistency
- reporting

PostgreSQL is excellent for ERP systems.

---

# Docker Setup

Create:

`docker-compose.yml`

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: erp_core

    ports:
      - '5432:5432'
```

Run:

```bash
docker compose up -d
```

---

# 9. MikroORM

## Why MikroORM?

MikroORM is good for:

- enterprise applications
- complex relations
- TypeScript
- clean architecture
- ERP systems

Install:

```bash
npm install @mikro-orm/core
npm install @mikro-orm/postgresql
npm install @mikro-orm/nestjs
npm install @mikro-orm/migrations
npm install @mikro-orm/cli
```

Create:

`mikro-orm.config.ts`

```ts
import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  host: process.env.DATABASE_HOST,

  port: Number(process.env.DATABASE_PORT),

  user: process.env.DATABASE_USER,

  password: process.env.DATABASE_PASSWORD,

  dbName: process.env.DATABASE_NAME,

  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],

  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },

  debug: true,
});
```

---

# Entity Example

Create:

`src/entities/User.ts`

```ts
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;
}
```

---

# Migration

Create migration:

```bash
npx mikro-orm migration:create
```

Run migration:

```bash
npx mikro-orm migration:up
```

---

# 10. Swagger

## Why?

Swagger automatically generates API documentation.

Install:

```bash
npm install @nestjs/swagger swagger-ui-express
```

Update `main.ts`

```ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('ERP API')
  .setDescription('ERP Backend APIs')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);

SwaggerModule.setup('docs', app, document);
```

Open:

```txt
http://localhost:3000/docs
```

---

# 11. Validation

## Why?

Validation protects APIs from invalid data.

Install:

```bash
npm install class-validator class-transformer
```

Update `main.ts`

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }),
);
```

---

# DTO Example

```ts
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
```

---

# 12. Helmet

## Why?

Adds security headers.

Protects against:

- XSS
- clickjacking
- attacks

Install:

```bash
npm install helmet
```

---

# 13. Compression

## Why?

Compresses API responses.

Benefits:

- faster APIs
- lower bandwidth

Install:

```bash
npm install compression
```

---

# Update `main.ts`

```ts
import helmet from 'helmet';
import compression from 'compression';

app.use(helmet());

app.use(compression());
```

---

# 14. Redis

## Why?

Used for:

- cache
- sessions
- queues
- OTPs

Install:

```bash
npm install ioredis
```

---

# 15. BullMQ

## Why?

Background jobs.

Examples:

- emails
- invoice PDF
- report export
- notifications

Install:

```bash
npm install bullmq
```

---

# Recommended Project Structure

```txt
src/
  common/
  config/
  entities/
  modules/
  utils/
```

---

# Recommended ERP Modules

```txt
modules/
  auth/
  users/
  ledgers/
  vouchers/
  inventory/
  gst/
  sales/
  purchase/
```

---

# First Modules To Build

1. Authentication
2. Users
3. Financial Year
4. Ledgers
5. Voucher Types
6. Voucher Engine
7. Trial Balance

---

# Important ERP Advice

Do NOT start with:

- dashboards
- charts
- fancy UI

First stabilize:

- accounting
- vouchers
- reports
- transactions

because ERP systems are mainly backend-heavy systems.

---
