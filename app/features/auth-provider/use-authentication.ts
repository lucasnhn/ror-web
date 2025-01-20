import { useContext } from "react";
import { AuthContext, AuthDispatchContext } from "./context";
import type { AuthenticationDispatchState, AuthenticationState } from "./types";

export function useAuthentication(): AuthenticationState &
  AuthenticationDispatchState {
  const context = useContext(AuthContext);
  const dispatchContext = useContext(AuthDispatchContext);

  if (!context || !dispatchContext) {
    throw new Error(
      "useAuthentication must be used within the AuthenticationProvider"
    );
  }

  return {
    ...context,
    ...dispatchContext,
  };
}
