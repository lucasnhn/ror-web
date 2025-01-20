import { ActionType } from "./action";
import type { AuthenticationAction, AuthenticationState } from "./types";

export function authReducer(
  state: AuthenticationState,
  action: AuthenticationAction
): AuthenticationState {
  switch (action.type) {
    case ActionType.SetAccessToken: {
      return {
        ...state,
        isAuthenticated: true,
        access_token: action.payload.accessToken,
      };
    }

    case ActionType.ClearAccessToken: {
      return {
        ...state,
        isAuthenticated: false,
        access_token: null,
      };
    }

    case ActionType.SetIdToken: {
      return {
        ...state,
        isAuthenticated: true,
        id_token: action.payload.idToken,
      };
    }

    case ActionType.ClearIdToken: {
      return {
        ...state,
        isAuthenticated: false,
        id_token: null,
      };
    }

    default:
      return state;
  }
}
