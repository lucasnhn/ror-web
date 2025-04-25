### How to create a new React component

In the ROR project, we've set up a streamlined process for creating new components using [Turborepo custom generator](https://turbo.build/repo/docs/guides/generating-code#custom-generators). This not only ensures consistency but also saves time by automatically creating all the necessary files.

The first step is to figure out if you want to create a component that should be in the application or in the library. See the previous section "React Component Library" for finding this out.

Lets assume that you want to create a new component to the `packages/react` library

#### Using the Turborepo Component Generator

Start by running this command

```bash
npx turbo gen component
```

When you run this command, you'll be prompted to enter a name for your component.

The name should be in lowercase (e.g., button, data-table, metrics-card).

The generator will automatically:

- Create a React component file in packages/react/src/components/[name].tsx
- Create a Storybook story in apps/docs/stories/[Name].stories.tsx
- Create a scss style file in packages/styles/scss/components/[name].scss

**Note**: The component generator and its templates for these files you will find under `/turbo`.

To make your component available for use, you need to export it properly:

```typescript
// packages/react/src/main.tsx
/// … other exports

export { MyComponent } from './components/my-component.tsx'
```

#### Best Practices for Component Development

1. **Controlled vs Uncontrolled**: When appropriate, support both patterns:

```tsx
// Controlled
<Input value={value} onChange={setValue} />

// Uncontrolled
<Input defaultValue="Default" />
```

2. **Accessibility**: Ensure components are accessible:
   - Use appropriate ARIA attributes
   - Ensure keyboard navigation works
   - Support screen readers
   - Maintain sufficient color contrast
3. **Composition**: Prefer composition over inheritance:

```tsx
// Good: Composable
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>

// Less flexible
<Card title="Title" content="Content" />
```

4. **Polymorphic Components**: For components that can render as different elements:
   Here we have two options, either use a `asChild` together with the [Radix UI Slot component](https://www.radix-ui.com/primitives/docs/utilities/slot) or the `as` property together with the `PolymorphicComponentProp` interface. The `Slot` component is perhaps better for more complex scenarios. Start with the `as` prop as a generic rule.

By following these guidelines, you'll create components that are consistent, reusable, and well-documented, making it easier for the team to use them effectively.

### How to extend the API Client

In short, the api client is used to make the interaction with the API easier, it wraps the different "endpoints" in services. One service might represent what you can do with a kubernetes cluster, for example fetching data about a single cluster. While under the hood the different methods might use the same endpoint it can make it easier if some of the necessary parameters are handled automatically or abstracted away.

Lets take a theoretical example where we want to wrap the endpoints for fetching _books_, where we can fetch a list of books, get a single book and create a book.

#### 1. Understanding the Backend Resource

First, identify what backend resource you need to work with and how it's exposed in the API:

1. Check the backend swagger documentation
2. Ask a developer to walk you through the endpoint and the data
3. Note the HTTP Method, URL structure and any possible parameters you need to know about

Once you have that you can either start by creating the service that wraps those endpoints or start by creating the models of the data structure.

Here we start with creating the model and type definitions using zod, but you are free to do how you would like.

#### 2. Create the data models and types

```typescript
// packages/js-api-client/src/schemas/book.ts
import { z } from 'zod'

export const AuthorSchema = z.object({
  name: z.string(),
})

// Define a Zod schema for validation
export const BookSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.number(),
  author: Author,
  // other properties...
})

export const BooksSchema = z.array(BookListItem)
```

I have split up the _model_ and the _types_ into two separate files to make it more explicit on what to actually export. Note that I append these

```typescript
// packages/js-api-client/src/types/entities.ts
import { z } from 'zod'
import { AuthorSchema, BookSchema, BooksSchema } from '../schemas/book.ts'

... // other exported types

export type Author = z.infer<typeof AuthorSchema>
export type Book = z.infer<typeof BookSchema>
export type Books = z.infer<typeof BooksSchema>
```

#### 3. Implementing the service

This is where we will define our methods that later a developer can use to interact with the API. This is also where we can abstract away things that might not be needed by the developer to specify.

```typescript
// packages/js-api-client/src/services/books.ts
import type { RequestOptions } from '../core/request'
import { validateResponse } from '../core/validation'
import { BooksSchema, BookSchema } from '../schemas/book.ts'

export const createBooksService = (request: (requestOptions: RequestOptions) => Promise<unknown>) => ({

	// In this theoretical example we will allow the developer to specify the sorting direction
	list: async (sortingDirection: 'asc' | 'desc' = 'asc') => {
		// Our fake abstraction about sorting order
		const params = new URLSearchParams()
		params.set('sortingOrder', sortingDirection)
		// Perform the actual request
		const response = await request({
	      method: 'GET',
	      path: '/v1/books', // Our actual endpoint path
	      params,
	    })
	    // Validate the response we got against the schema we have
	    // This ensures that our understanding of the data model is correct
	    // if something in our understanding is wrong, this will throw an error
	    return validateResponse(response, BooksSchema)
	}

)}
```

#### 5. Make the service available in the client

This in the puzzle bit that makes the service available.

```typescript
// packages/js-api-client/src/core/create-api-client.ts
import { createBooksService } from '../services/books.ts'

export function createApiClient(config: ApiClientConfig) {
  // Other code code...

  const services = {
    kubernetesClusters: createKubernetesClusterService(request),
    nodes: createNodesService(request),
    users: createUsersService(request),
    books: createBooksService(request),
  }

  return services
}
```

For a developer it will now look like this

```typescript
// Setup the client with its ApiClientConfig
const client = createApiClient(myConfig)

// Fetch books
const books = await client.books.list()
```

#### 6. Export Types from the Package

Make sure the types are exported from the package:

```typescript
// packages/js-api-client/src/index.ts

// Other exports ...

export type {
  ... other types
  Books,
  Book,
  Author
} from './types/entities'
```

#### 7. Usage in the Web Application (apps/web)

Now you can use your new service in the application:

Note that in the web-app we have wrapped the `createApiClient` in a separate function called `rorApiClient`.

```typescript
// From a server component
import { rorApiClient } from '@/services/ror-api'
import { authGuard } from '@/features/auth/utils/auth-guard'

export default async function BooksPage() {
  const session = await authGuard()
  const client = rorApiClient(session.accessToken)

  // Use your new resource
  const books = await client.books.list()

  return (
    <div>
      <h1>Books</h1>
      {/* Render resources */}
    </div>
  )
}
```
