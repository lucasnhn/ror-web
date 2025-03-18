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
AUTH_TRUST_HOST=true
NEXT_PUBLIC_ROR_API_URL=
NEXT_PUBLICK_MOCKING_ENABLED=false
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

## Mocking
The web application uses [mswjs](https://mswjs.io/) to mock API requests. To enable mocking, set `NEXT_PUBLICK_MOCKING_ENABLED` to `true` in the appropriate environment file.
Further configuration and which requests that are mocked can be found in `/apps/web/__mocks__/handlers.ts`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Open Telemetry

The web application is instrumented with Open Telemetry to collect telemetry data. See `apps/web/instrumentation.ts` for implementation and [Next.js Open Telemetry Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry).

It is possible to configure custom spans, see [Next.js Custom Spans](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry#custom-spans) for more information.

# Generator

This repository includes a built-in component generator powered by Turborepo and Plop.js to streamline the creation of new files.

All generators are located in the `turbo/generators` directory.

For full documentation, see [Turborepo Generating Code Documentation](https://turbo.build/repo/docs/guides/generating-code).

### Generate a new React component

To generate a new component, run:

```bash
npx turbo gen component
```

When prompted, enter a component name (in lowercase). The generator will automatically:

1. Create a React component file at `packages/react/src/components/[name].tsx`
2. Create a Storybook story file at `apps/docs/stories/[Name].stories.tsx`
3. Create a SCSS file at `packages/styles/scss/components/[name].scss`

All files are created with proper naming conventions (dash-case for CSS, PascalCase for React components) and include the basic boilerplate code, imports, and styling setup.

Note: You will still need to manually import the generated component into the respective main application file.
- `packages/react/src/main.tsx`
- `packages/styles/scss/components/_index.scss`

### Example

```bash
$ npx turbo gen component
? What is the name of the new component? (lowercase) button
```

This will generate:
- `packages/react/src/components/button.tsx`
- `apps/docs/stories/Button.stories.tsx`
- `packages/styles/scss/components/button.scss`
```
