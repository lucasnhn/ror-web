These are some of the early design choices we have made in this project.

### Next.js

**Location**: `apps/web`

We chose Next.js primarily for:

- Security benefits from server-side rendering
- Built-in API routes and middleware
- React-based development experience
- Mature framework compared to more experimental options like React Router v7

Using App Router gives us the flexibility to choose between server and client components based on specific needs.

- Interested in the documentation, go to [nextjs.org/docs](https://nextjs.org/docs).
- Are you new to Next.js? Visit [nextjs.org/learn](https://nextjs.org/learn).

### Storybook for documentation

**Location**: `apps/docs`
Since we will have a set of components in a medium-large codebase is it important that components are easy to discover and understand. The risk is otherwise that we duplicate work.
By having Storybook as an application we can easily document not only our React component library but also write documentation for many other things as well.

Learn more at [Storybook](https://storybook.js.org/).

### Styling

**Location**: `packages/styles`

We have chosen a mix of writing our own _design system_ (meaning our own sets of design tokens) and using TailwindCSS. The main reason for mixing between the two is that some component can be very complexed and Tailwind in that sense can become unwieldy. By using css/sass for at least or common React components, spacing scale, text-styles e.t.c it becomes easier to maintain and change. The benefit of using Tailwind lies in its ability to quickly build layouts.

Tailwind is of course configurable so there is and should be an attempt to make sure that both our own design system and sets of token is in sync with the tailwind configuration. For example the spacing scaling should be the same, colors should be available as utility classes and so on.

The tailwind configuration is specified in `apps/web/src/styles/tailwind.css`.

- [Learn more about SASS](https://sass-lang.com/guide/).
- [Learn more about TailwindCSS](https://tailwindcss.com/)

### Color palette

We have chosen to use a color palette known as [Harmony](https://github.com/evilmartians/harmony).

> The Harmony palette is designed to elevate control over color contrast in your design system.
>
> - Uses OKLCH and APCA for highly consistent color shades
> - Has P3 options for modern screens
> - Created to keep precise control over text and UI element contrast

The main reason that we use this color palette is thanks to having

- Equal contrast within lightness groups
- Mirrored contrast pairs
- Contrast levels for readability

This means for example that tags that are displayed with different colors but with name shade, e.g `blue:500|red:500|green:500` etc all have the same contrast. It is also to see which colors needs to have a black or white text for sufficient contrast.

In the web application is in installed via npm so it overrides the tailwind configuration while we have a local copy in `packages/styles/scss/colors` for use in our styles library.

### React Component Library

**Location**: `packages/react`

The reason for having a separate component library is mainly to make it easier to write very generic components without implicitly or explicitly tie them to business or data logic. It also makes it easier to configure linting and in the future testing.

Our component library follows several key principles:

- **Generic and Reusable**: Components should be business-logic agnostic, meaning they should only be focusing on establishing UI patterns.
- **Controlled vs Uncontrolled**: Components should support both patterns when appropriate, making them flexible in different contexts. Don't know what it is? Check out [Controlled and Uncontrolled Components](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
- **Headless UI Approach**: We favor libraries like [Radix UI](https://www.radix-ui.com/primitives) that provide accessibility and behavior without imposing visual design, giving us flexibility while maintaining productivity. It removes a lot of complexity for building the more advanced components. Some other headless libraries that are viable candidates are [headlessui.com](https://headlessui.com/) or [base-ui.com](https://base-ui.com/).

#### How do I know where to place a React component, should it go into the specific application or the library?

This is a common question that even experienced developers often ask themselves. Here's a guide to help you make this decision:

##### Place a component in the library (`packages/react`) when:

1. **It's generic and reusable**
   - The component doesn't contain business logic specific to ROR
   - It could be used in multiple contexts or projects
   - It represents a common UI pattern (buttons, cards, tables, form elements)
2. **It's foundational**
   - Other components build upon it
   - It implements basic interaction patterns
   - It's part of our core design system
3. **It has no external dependencies**
   - It doesn't rely on specific API data structures
   - It doesn't import from application-specific code
   - It doesn't depend on routing or other framework-specific features

##### Place a component in the application (`apps/web`) when:

1. **It's specific to ROR business logic**
   - It displays domain-specific information (e.g., ClusterDetails, UserProfile)
   - It implements workflows unique to the application
2. **It's tied to application infrastructure**
   - It relies on Next.js features like App Router
   - It uses application-specific hooks or contexts
   - It interacts directly with the ROR API client
3. **It's a composition of library components**
   - It combines multiple library components to create a feature
   - It handles application state and data flow
   - It connects UI to business logic
4. **It's a page or layout**
   - Page components that represent routes
   - Layout components specific to the application structure

###### Examples:

| Library Component | Application Component |
| ----------------- | --------------------- |
| Button            | ClusterDetailsPage    |
| DataTable         | UserProfileCard       |
| Form inputs       | NavigationBar         |
| Modal             | DashboardMetrics      |
| Tooltip           | AuthForm              |

##### Grey areas and decision factors:

Sometimes the decision isn't clear-cut. Consider these factors:

1. **Reusability potential**: How likely is it that this component will be needed elsewhere?
2. **Maintenance burden**: Would putting it in the library create unnecessary coupling?
3. **Complexity**: Is the component simple enough that duplicating it wouldn't be a problem?
4. **Evolution**: How likely is the component to change with business requirements?

When in doubt, start with the component in the application. It's easier to extract a component into the library later than to move it back into the application after dependencies form around it.

### Rolling our own API Client (`packages/js-api-client`)

The `js-api-client` package was created to provide a structured interface to the ROR API.

In short, the package is designed to

- Provide typed interfaces and validation of the data sent or received
- Handle authentication (this is quite basic, just a header with the passed in access token)
- Abstract away HTTP details by wrapping `fetch`.
- Provide consistent error handling

A key motivation to write our own client was to provide a intuitive way to discover and use the api.

For example:

- The backend uses a generic resource model under `/v2` endpoints for all data
- There are no dedicated endpoints for specific entity types like clusters

So Instead of remembering complex query parameters, developers can use purpose-built functions that the library exports in one way or another.

#### Under the hood

The package in sense pretty much wraps the native `fetch` method and uses the library [Zod](https://zod.dev/) for validation of data. Zod also gives us typescript types.

#### Current Implementation

The current design uses a resource-based approach that organizes endpoints in a way that makes more sense for frontend consumption:

```typescript
// Creating a client instance with an accessToken
const client = rorApiClient(session.accessToken)

// Using resource-specific methods
const clusters = await client.clusters.filter(options)
const cluster = await client.clusters.get(id)
const user = await client.users.self()
```

**Note:** The design of this api client is it is very early stage, if you find it to complex or that you are working more against it then it helps you. Then change it! But do try and keep the foundational thinking for what the library should do.

A different implementation could perhaps be to export functions of the individual methods, for instance

```typescript
import { fetchClusters, fetchClusterById } from '@ror/js-api-client';

const clusters = await fetchClusters({ accessToken: session.accessToken, filters: … })
const cluster = await fetchClusterById("aaa-001");

```

So do think about changing the api client to make it easier to maintain.

### Mocking APIs

**Location**: `apps/web/__mocks__`

Mocking can be used for many different reasons, for us there are a particular cases so far we use it for, namely:

1. Parallel development between frontend and backend. We can agree on how an endpoint should work and how the data should be structured and then work separately on it.
2. We can manually display data for particular endpoints in order to build or test certain features

The web application uses [MSW](https://mswjs.io/) for mocking API requests.

It does so by existing as a proxy (using service workers) between our application and whatever is called. By defining "handlers" we explicitly say that we want to intercept this request and define how to handle it. We mainly use for mocking API request to the ROR API.

1. Enable mocking by setting `NEXT_PUBLIC_MOCKING_ENABLED=true` in the web applications env file that you have.
2. Handlers are defined in `apps/web/__mocks__/handlers/`
3. Mock data is in `apps/web/__mocks__/data/`

By using MSW we can granularly handle many different situations, making sure that mock itself is as close to the real API implementation.
