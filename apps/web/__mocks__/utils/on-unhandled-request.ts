export const ignoreList: string[] = ['_next', '__next', 'stream', 'http://localhost:4318/v1/traces']

export function onUnhandledRequest(request: Request, print: { warning: () => void }) {
  // Get just the path part of the URL
  const url = new URL(request.url)
  const path = url.pathname

  const onIgnoreList = ignoreList.some(
    (ignore) =>
      path.startsWith(`/${ignore}`) || // Check if path starts with the ignored prefix
      path.includes(ignore) || // Check if path includes the ignored string
      ignore === request.url // Check for exact URL match
  )

  if (onIgnoreList) {
    return
  }

  return print.warning()
}
