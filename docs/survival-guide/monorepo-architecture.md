The project is structured as a monorepo, which means multiple related packages are managed within a single repository.

### Why a Monorepo?

- Single Responsibility Principle: Each package has a clearly defined purpose and responsibility
- Avoiding Tooling Conflicts: Different packages can have their own configurations (tsconfig, eslint, etc.) without conflicts
- Sharing Code: Easily share code between packages while maintaining clear boundaries

The primary workspaces in our monorepo as of now are:

```
/
├── apps/          # Applications that can be hosted
│   ├── web/       # Main Next.js application
│   └── docs/      # Storybook documentation of the shared React components
├── packages/
│   ├── react/     # Shared React components
│   ├── js-api-client/ # API client for the ROR API
│   └── styles/    # Shared styles
```

Want to learn more about Monorepo, check out [Monorepo Maestros](https://www.shew.dev/monorepos).
