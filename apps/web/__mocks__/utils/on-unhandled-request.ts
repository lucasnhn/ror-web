export const ignoreList: string[] = ['_next', '__next', 'stream', 'http://localhost:4318/v1/traces']

export function onUnhandledRequest(request: Request, print: { warning: () => void }) {
  const onIgnoreList = ignoreList.some((ignore) => ignore.includes(request.url) || ignore === request.url)

  if (onIgnoreList) {
    return
  }

  return print.warning()
}
