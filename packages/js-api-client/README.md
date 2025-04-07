# @ror/js-api-client

A TypeScript client for interacting with the ROR API.

## Installation

This package is private and available only within the ROR project workspace (at the moment)

You can install in a local package by manually adding it to your `package.json` file:

```json
{
  "dependencies": {
    "@ror/js-api-client": "*"
  }
}
```

## Usage

### Basic Setup

```typescript
import { createApiClient } from '@ror/js-api-client'

const apiClient = createApiClient({
  baseUrl: 'https://api.example.com',
  accessToken: 'your-access-token',
  // Optional additional headers
  headers: {
    'X-Custom-Header': 'value',
  },
})
```

### Working with Services

The client provides access to various service endpoints:

The service endpoints are under construction, therefore expect regular changes as they are being developed.

```typescript
// List Kubernetes clusters
const params = new URLSearchParams()
const clusters = await apiClient.kubernetesClusters.list(params)

// Get a cluster by ID
const cluster = await apiClient.kubernetesClusters.id('cluster-id')

// List nodes for a specific cluster
const nodes = await apiClient.nodes.listByCluster('cluster-id')

// Get user information
const user = await apiClient.users.self()

// List ingresses
const ingresses = await apiClient.ingresses.list()
```

### Error Handling

The client provides a comprehensive set of error classes to handle various API error scenarios:

#### Error Types

- **`ApiError`**: The base error class for all API-related errors. Contains:

  - `status`: HTTP status code
  - `message`: Error message
  - `details`: Optional additional error details

- **`NetworkError`**: Extends `ApiError`. Thrown when there are network-related issues.

- **`AuthenticationError`**: Extends `ApiError` with status 401. Thrown when authentication fails, typically due to invalid or expired credentials.

- **`AuthorizationError`**: Extends `ApiError` with status 403. Thrown when the authenticated user lacks permissions to access a resource.

- **`NotFoundError`**: Extends `ApiError` with status 404. Thrown when the requested resource doesn't exist.

- **`ValidationError`**: Extends `ApiError` with status 422. Contains detailed validation errors:
  - `validationErrors`: A record mapping field paths to arrays of error messages

#### Using Error Types

```typescript
import {
  isApiError,
  ApiError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from '@ror/js-api-client'

try {
  // API call
  const cluster = await apiClient.kubernetesClusters.id('cluster-id')
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Handle 401 - redirect to login or refresh token
    console.error('Authentication failed. Please login again.')
  } else if (error instanceof AuthorizationError) {
    // Handle 403 - show permission denied message
    console.error('You do not have permission to access this resource.')
  } else if (error instanceof NotFoundError) {
    // Handle 404 - show not found message
    console.error('The requested resource was not found.')
  } else if (error instanceof ValidationError) {
    // Handle validation errors with field-specific messages
    console.error('Validation failed:')
    Object.entries(error.validationErrors).forEach(([field, messages]) => {
      console.error(`- ${field}: ${messages.join(', ')}`)
    })
  } else if (isApiError(error)) {
    // Handle other API errors
    console.error(`API Error (${error.status}): ${error.message}`)
    if (error.details) {
      console.error(`Details: ${error.details}`)
    }
  } else {
    // Handle unexpected errors
    console.error('An unexpected error occurred:', error)
  }
}
```

#### Helper Function

The package includes `isApiError()` utility to safely check if an error is an instance of `ApiError` or any of its subclasses:

```typescript
if (isApiError(error)) {
  // Safe to access error.status, error.message, etc.
}
```

This error handling system provides detailed information about what went wrong during API interactions, enabling you to respond appropriately in your application.

## Development

### Available Scripts

- `npm run dev` - Watch for changes and rebuild
- `npm run build` - Build the package
- `npm run clean` - Clean build outputs and dependencies

### Project Structure

```
src/
├── core/               # Core client functionality
├── schemas/            # Zod schemas for response validation
├── services/           # Service implementations for different API endpoints
├── types/              # TypeScript type definitions
└── index.ts            # Main export file
```

## Type Exports

The package exports various TypeScript types for working with the API:

```typescript
import type { Ingress, Cluster, KubernetesCluster, Node, User } from '@ror/js-api-client'
```
