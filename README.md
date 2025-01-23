# Welcome to ROR GUI
Frontend for admin GUI in the ROR project.

## Tech Stack
- 🔒 TypeScript by default
- 📖 [React Router](https://reactrouter.com/)
- 🎨 Styling (To be decided)

## Requirements
- Minimum [Node.js](https://nodejs.org/en/) v22.9.0
  - due to [--env-file-if-exists](https://nodejs.org/dist/v22.13.1/docs/api/cli.html#--env-file-if-existsconfig) usage in package.json start script

## Getting Started

### Setup environmental variables

Copy the `.env.example` file to `.env.local` and fill in the necessary values.

```bash
/// .env.local
VITE_AUTH_ISSUER=http://**/dex
VITE_AUTH_CLIENT_ID=MY_AUTHENTICATION_CLIENT_ID
VITE_AUTH_CLIENT_SECRET=MY_AUTHENTICATION_CLIENT_SECRET
VITE_AUTH_REDIRECT_URI=http://localhost:11000/auth/callback
VITE_ROR_API_URL=OUR_INSTANCE_OF_ROR_API
VITE_SIGNING_SECRET=
VITE_FORCE_TLS=false
```

**Note**: Environmental variables will be validated running runtime and mapped to a different naming convention. See `/app/env.ts` for implementation details.

To generate a secret for `VITE_SIGNING_SECRET` you can run the following command:

```bash
openssl rand -base64 32
```

The secret is used for signing cookies meant to be used for session management.

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:11000`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment
