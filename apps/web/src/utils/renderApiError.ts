import ErrorPage from '@/app/(public)/error/page'
import { routes } from '@/config/routes'
import { AuthenticationError, AuthorizationError, isApiError, NotFoundError, ValidationError } from '@ror/js-api-client'

export function RenderApiError(error: unknown) {
  let errorButtonLink: string
  let errorText: string
  const clustersPage = routes.app.clusters.getHref()
  const buttonTextHomepage = 'return to homepage'

  if (error instanceof AuthenticationError) {
    // Handle 401 - redirect to login or refresh token
    console.error('Authentication failed. Please login again.')
    const errorButtonLink = routes.auth.signIn.getHref()

    return ErrorPage({
      errorCode: '401',
      errorText: 'Forbidden',
      errorButtonText: 'Go to login',
      errorButtonLink: errorButtonLink,
    })
  } else if (error instanceof AuthorizationError) {
    // Handle 403 - show permission denied message
    errorText = 'You do not have permission to access this resource.'
    console.error(errorText)
    errorButtonLink = clustersPage
    return ErrorPage({
      errorCode: '403',
      errorText: errorText,
      errorButtonText: buttonTextHomepage,
      errorButtonLink: errorButtonLink,
    })
  } else if (error instanceof NotFoundError) {
    // Handle 404 - show not found message
    errorText = 'The requested resource was not found.'
    console.error(errorText)
    errorButtonLink = clustersPage
    return ErrorPage({
      errorCode: '403',
      errorText: errorText,
      errorButtonText: buttonTextHomepage,
      errorButtonLink: errorButtonLink,
    })
  } else if (error instanceof ValidationError) {
    // Handle validation errors with field-specific messages
    console.error('Validation failed:')
    const details = Object.entries(error.validationErrors)
      .map(([field, messages]) => {
        const msgArray = Array.isArray(messages) ? messages : [String(messages)]
        return `- ${field}: ${msgArray.join(', ')}`
      })
      .join('\n')
    console.error(details)
    return ErrorPage({
      errorCode: '400',
      errorText: 'Validation error occurred.',
      errorButtonText: buttonTextHomepage,
      errorButtonLink: routes.app.clusters.getHref(),
    })
  } else if (isApiError(error)) {
    // Handle other API errors
    console.error(`API Error (${error.status}): ${error.message}`)
    if (error.details) {
      console.error(`Details: ${error.details}`)
    }

    return ErrorPage({
      errorCode: String(error.status),
      errorText: error.message,
      errorButtonText: 'Go Back',
      errorButtonLink: routes.app.clusters.getHref(),
    })
  } else {
    // Handle unexpected errors
    console.error('An unexpected error occurred:', error)
    return ErrorPage({
      errorCode: '500',
      errorText: 'An unexpected error occurred.',
      errorButtonText: buttonTextHomepage,
      errorButtonLink: clustersPage,
    })
  }
}
