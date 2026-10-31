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

See `server/.env.example` and `client/.env.example`. Configure a Firebase Web app in `client/.env`, and set the Firebase Admin service-account JSON in `server/.env`. Keep the service-account JSON private; never expose it through `VITE_` variables or commit it. The setup command generates a local JWT secret but does not configure Firebase. Never commit real `.env` files or use development secrets in production.

## OTP authentication

- New registrations use Firebase email/password authentication and must verify the Firebase email link before a FinWise session is created. Sign-up will not work until the Firebase web and Admin credentials below are configured.
- Sign in with email/password or Firebase phone authentication with SMS OTP. Firebase manages code issuance and verification; the API verifies Firebase ID tokens with the Admin SDK before issuing a FinWise API token.
- To link a phone number, sign in with the Firebase email account and use **Phone login** in the sidebar. Firebase displays reCAPTCHA and verifies the SMS code.
- In Firebase Console, enable **Email/Password** and **Phone** providers, add `localhost` and your deployed host to Authentication's authorized domains, and configure Firebase's email verification template.
- Copy the Firebase web app's API key, Auth domain, Project ID, App ID, and Messaging sender ID into the matching `VITE_FIREBASE_*` entries in `client/.env`. Put the service-account JSON from Firebase Console → Project settings → Service accounts into `FIREBASE_SERVICE_ACCOUNT_JSON` in `server/.env`. The service-account JSON is a private server credential.
- Firebase phone auth requires billing/region configuration and may require SMS test numbers during development. Do not create a client-side OTP bypass.

## API

Base path: `/api/v1`.

- `GET /health`
- `POST /auth/firebase/session`
- `GET /auth/me`, `POST /auth/logout`
- `POST /auth/firebase/phone/link` (protected)
- `GET, POST /accounts`
- `GET, POST /transactions`, `DELETE /transactions/:id`
- `GET, POST /budgets`
- `GET, POST /goals`
- `GET /dashboard/overview`, `GET /products`
- `POST /calculators/:type`

Protected endpoints require a bearer access token in the `Authorization` header. Amounts entered by users are stored as integer paise; calculator inputs and display results use rupees.

## Before production

This starter still needs a production-readiness review. At minimum, add stronger session/token lifecycle management, authorization and API integration tests, deployment-specific HTTPS/CORS/secrets management, backups, monitoring, and distributed rate limiting. Review Firebase authentication settings, privacy, and financial-product compliance with qualified professionals. Verify all financial calculations and changing product information with domain experts and current official sources.
