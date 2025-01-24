# Welcome to ROR GUI
Frontend for admin GUI in the ROR project.

## Tech Stack
- 🔒 TypeScript by default
- 📖 [Next.js](https://nextjs.org/docs)
- 🎨 Styling (To be decided)

## Getting Started

### Setup environmental variables

Copy the `.env.example` file to `.env.local` and fill in the necessary values.

```bash
/// .env.local
AUTH_SECRET=
AUTH_ISSUER=
AUTH_CLIENT_ID=
AUTH_CLIENT_SECRET=
ROR_API_URL=
```

**Note**: Environmental variables will be validated running runtime and mapped to a different naming convention. See `/env.ts` for implementation details.

To generate a secret for `AUTH_SECRET` you can run the following command:

```bash
openssl rand -base64 32
```

The secret is used for session management by the `next-auth` library.

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
