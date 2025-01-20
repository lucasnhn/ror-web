/**
 * Get a cookie value by name from a string of cookies, e.g. request.headers.get("Cookie")
 * @param name - the name of the value you want to get
 * @returns string | null
 */
export function getCookieValueByName(name: string): string | null {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}
