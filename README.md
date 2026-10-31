# FinWise India

FinWise India is a development-ready MERN starter for personal finance tracking. It includes a React/Vite client and an Express/Mongoose API for authentication, accounts, transactions, budgets, goals, calculators, dashboard summaries, and a demo financial-products catalogue.

This is not a regulated financial service or production-ready banking application. It does not connect to banks, execute trades, or provide personalized investment advice. Demo product data and calculator estimates are illustrative, not offers or guaranteed outcomes.

## Requirements

- Node.js 20 or newer
- npm
- Docker Desktop for the optional local MongoDB container, or a MongoDB instance/Atlas URI

## Quick start (Windows PowerShell)

From the project root:

```powershell
npm run setup:deps
npm run setup
docker compose up -d mongodb
npm run dev
```

The client runs at <http://localhost:5173> and the API at <http://localhost:5000>.
The setup command creates `server/.env` and `client/.env` from the checked-in examples, generating a random development JWT secret. Existing `.env` files are left untouched. If you do not use Docker, configure `MONGO_URI` in `server/.env` to point to your MongoDB instance before starting the API.

To load the illustrative product catalogue:

```powershell
npm run seed:products
```

To stop the optional MongoDB container:

```powershell
docker compose down
```

Data is kept in the Docker volume `finwise-mongodb-data`; `docker compose down -v` removes that data.

## Useful commands

Run these from the project root:

| Command | Purpose |
| --- | --- |
| `npm run setup` | Create local environment files without overwriting existing ones |
| `npm run setup:deps` | Install root, client, and server dependencies |
| `npm run dev` | Run the client and API together |
| `npm run dev:client` | Run only the client |
| `npm run dev:server` | Run only the API |
| `npm run build` | Build the client for production |
| `npm test` | Run the client and server test suites |
| `npm run lint` | Lint client and server source |
| `npm run format` | Format project files with Prettier |
| `npm run seed:products` | Add demo products to MongoDB |

## Environment variables

See `server/.env.example` and `client/.env.example`. The server needs `MONGO_URI` and a private `JWT_SECRET`; the setup command generates a random local secret. Never commit real `.env` files or use development secrets in production.

## API

Base path: `/api/v1`.

- `GET /health`
- `POST /auth/register`, `POST /auth/login`
- `GET /auth/me`, `POST /auth/logout`
- `GET, POST /accounts`
- `GET, POST /transactions`, `DELETE /transactions/:id`
- `GET, POST /budgets`
- `GET, POST /goals`
- `GET /dashboard/overview`, `GET /products`
- `POST /calculators/:type`

Protected endpoints require a bearer access token in the `Authorization` header. Amounts entered by users are stored as integer paise; calculator inputs and display results use rupees.

## Before production

This starter still needs a production-readiness review. At minimum, add account recovery and email verification, stronger session/token lifecycle management, authorization and API integration tests, deployment-specific HTTPS/CORS/secrets management, backups, monitoring, and rate-limit tuning. Review privacy and financial-product compliance with qualified professionals. Verify all financial calculations and changing product information with domain experts and current official sources.
