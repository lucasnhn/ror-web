import type { PropsWithChildren } from "react";

interface RootProviderProps {}

export function RootProvider({
  children,
}: PropsWithChildren<RootProviderProps>) {
  return children;
}
