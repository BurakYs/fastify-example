<img src="https://raw.githubusercontent.com/fastify/graphics/master/fastify-1000px-square-01.png" align="left" width="150" height="150" alt="Fastify Logo">

# 🚀 Fastify Boilerplate

A simple boilerplate for a REST API using Fastify, TypeScript, Zod, and Swagger.

<br />

### ⚙️ Features

- Database: [MongoDB](https://www.mongodb.com) with [Mongoose](https://mongoosejs.com)
- Validation: [Zod](https://zod.dev)
- Logging: [Pino](https://getpino.io)
- Linting & Formatting: Biome - [Biome](https://biomejs.dev)
- API Documentation: [Swagger](https://swagger.io)
- Testing: [Vitest](https://vitest.dev)

## 🛠️ Commands

- `pnpm start`: Start the production server
- `pnpm dev`: Start the development server
- `pnpm dev:watch`: Start the development server with file watching
- `pnpm typecheck`: Run type checking
- `pnpm lint`: Run linter
- `pnpm format`: Format the code
- `pnpm test`: Run tests
- `pnpm check`: Run all checks (type checking, formatting and tests)

## 📦 Setup

```sh
git clone https://github.com/BurakYs/fastify-example.git
cd fastify-example
pnpm install
cp .env.example .env
```

## 📝 License

This project is licensed under the [MIT License](./LICENSE).