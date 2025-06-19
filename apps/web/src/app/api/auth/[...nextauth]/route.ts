import { handlers } from '@/types/next-auth'

/**
 * This route exposes a GET and a POST api handler from next-auth.
 * It is a catch-all route meaning it catches all request for and after the /api/auth/ path.
 *
 * @remarks
 * It enables "all" authentication functionality via these endpoint handlers.
 * e.g. for sign-in you can use the following URL: /api/auth/signin
 *
 * @see https://authjs.dev/ for more information
 */
export const { GET, POST } = handlers
