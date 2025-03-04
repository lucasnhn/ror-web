/**
 * Only print DX error messages from MSW for these urls.
 * They are meant to help the developer see that a request was not caught by MSW
 */
export const warningList: string[] = [process.env.NEXT_PUBLIC_ROR_API_URL as string]

export function onUnhandledRequest(request: Request, print: { warning: () => void }) {
  if (warningList.some((warning) => warning.includes(request.url))) {
    return print.warning()
  }

  return
}
