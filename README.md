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
The setup command creates `server/.env` and `client/.env` from the checked-in examples and generates a random development JWT secret. Existing `.env` files are left untouched. If you do not use Docker, configure `MONGO_URI` in `server/.env` to point to your MongoDB instance before starting the API.

## Deploy the full app to Netlify

The Netlify site serves the Vite client and runs the Express API as a Netlify Function. The database must be hosted separately, for example with MongoDB Atlas.

1. Push the project to a Git provider and import the repository in Netlify. Keep the base directory at the repository root; the checked-in `netlify.toml` configures the build, publish directory, and API function.
2. Create a MongoDB database and database user, then add these variables under **Site configuration → Environment variables**:
   - `MONGO_URI`: the MongoDB connection URI.
   - `JWT_SECRET`: a newly generated, strong production secret. Do not reuse the development secret.
   - `CLIENT_URL`: the exact origin of the Netlify site, such as `https://your-site.netlify.app`.
3. Trigger a deploy after saving the variables. The client calls `/api/v1` on the same site, and the function serves API routes under that path.
4. Verify the deployment at `https://your-site.netlify.app/api/v1/health`.

`MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` are server-side settings; do not prefix them with `VITE_` or put their values in client files. `VITE_API_URL` is set to `/api/v1` by `netlify.toml`. Configure the database provider's network access for Netlify using a secure option supported by your plan; do not use a broadly open database access rule for production. The API's in-memory rate limiter is not shared across serverless instances, so add a distributed rate limiter before production use.

To load the illustrative product catalogue:

```powershell
npm run seed:products
```

The demo catalogue includes student-focused savings, education-loan, scholarship, and long-term investing examples. These are educational examples, not current offers or personalized financial advice. Verify programme eligibility and product terms with official providers.

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

See `server/.env.example` and `client/.env.example`. The setup command generates a local JWT secret. Never commit real `.env` files or use development secrets in production.

## Authentication

- Register with an email address and password, then sign in with those credentials. Passwords are hashed with bcrypt on the API; the API issues a signed FinWise access token.
- Accounts created before this authentication change cannot sign in unless their passwords are migrated or reset by an administrator.
- Email verification and phone/SMS sign-in are not supported.

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

This starter still needs a production-readiness review. At minimum, add stronger session/token lifecycle management, authorization and API integration tests, deployment-specific HTTPS/CORS/secrets management, backups, monitoring, and distributed rate limiting. Review authentication settings, privacy, and financial-product compliance with qualified professionals. Verify all financial calculations and changing product information with domain experts and current official sources.
