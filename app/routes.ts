import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    /**
     * Public routes
     */
    index("routes/home.tsx"),

    /**
     * Authorization routes
     */

    layout("routes/auth/layout.tsx", [
      route("login", "routes/auth/login.tsx"),
      route("logout", "routes/auth/logout.tsx"),
      route("unauthorized", "routes/auth/unauthorized.tsx"),
    ]),
    // These are simply resource routes, they should only be run on the server
    route("auth/login", "routes/auth/authorize.tsx"),
    route("auth/callback", "routes/auth/callback.tsx"),

    /**
     * Protected routes
     * @remarks
     * This layout should ensure that the user is authenticated before rendering the
     * child routes, otherwise it will redirect to the login page.
     */
    layout("routes/protected/layout.tsx", [
      route("dashboard", "routes/protected/dashboard.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
