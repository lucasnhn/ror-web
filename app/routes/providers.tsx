import type { PropsWithChildren } from "react";
import { AuthenticationProvider } from "~/features/auth-provider/provider";

interface RootProviderProps {}

export function RootProvider({
  children,
}: PropsWithChildren<RootProviderProps>) {
  return <AuthenticationProvider>{children}</AuthenticationProvider>;
}
