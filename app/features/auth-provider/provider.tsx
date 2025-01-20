import { useEffect, useMemo, useReducer, type PropsWithChildren } from "react";
import { AuthContext, AuthDispatchContext } from "./context";
import { authReducer } from "./reducer";
import type {
  AuthenticationAction,
  AuthenticationDispatchState,
  AuthenticationState,
} from "./types";
import * as actions from "./action";

const initialState: AuthenticationState = {
  isAuthenticated: false,
  access_token: null,
  id_token: null,
};

export function AuthenticationProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer<
    AuthenticationState,
    [AuthenticationAction]
  >(authReducer, initialState);

  /**
   * Sync the access token and id token in our state from local storage
   */
  useEffect(() => {
    const savedAccessToken = window.localStorage.getItem("__ror_access_token");
    if (savedAccessToken) {
      dispatch(actions.setAccessToken(savedAccessToken));
    }

    const savedIdToken = window.localStorage.getItem("__ror_id_token");
    if (savedIdToken) {
      dispatch(actions.setIdToken(savedIdToken));
    }
  }, []);

  function setAccessToken(accessToken: string): void {
    dispatch(actions.setAccessToken(accessToken));
  }

  function clearAccessToken(): void {
    dispatch(actions.clearAccessToken());
  }

  function setIdToken(idToken: string): void {
    dispatch(actions.setIdToken(idToken));
  }

  function clearIdToken(): void {
    dispatch(actions.clearIdToken());
  }

  const dispatchValues: AuthenticationDispatchState = useMemo(
    () => ({
      setAccessToken,
      clearAccessToken,
      setIdToken,
      clearIdToken,
    }),
    []
  );

  return (
    <AuthContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatchValues}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}
