import type {
  ClearAccessTokenAction,
  ClearIdTokenAction,
  SetAccessTokenAction,
  SetIdTokenAction,
} from "./types";

export const enum ActionType {
  SetAccessToken = "SET_ACCESS_TOKEN",
  ClearAccessToken = "CLEAR_ACCESS_TOKEN",
  SetIdToken = "SET_ID_TOKEN",
  ClearIdToken = "CLEAR_ID_TOKEN",
}

export function setAccessToken(accessToken: string): SetAccessTokenAction {
  return {
    type: ActionType.SetAccessToken,
    payload: {
      accessToken,
    },
  };
}

export function clearAccessToken(): ClearAccessTokenAction {
  return {
    type: ActionType.ClearAccessToken,
  };
}

export function setIdToken(idToken: string): SetIdTokenAction {
  return {
    type: ActionType.SetIdToken,
    payload: {
      idToken,
    },
  };
}

export function clearIdToken(): ClearIdTokenAction {
  return {
    type: ActionType.ClearIdToken,
  };
}
