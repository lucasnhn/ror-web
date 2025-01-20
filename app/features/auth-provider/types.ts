import type { ActionType } from "./action";

export interface AuthenticationState {
  isAuthenticated: boolean;
  access_token: string | null;
  id_token: string | null;
}

interface Action<T extends String> {
  type: T;
}

interface ActionWithPayload<T extends String, Payload> extends Action<T> {
  payload: Payload;
}

export type SetAccessTokenAction = ActionWithPayload<
  ActionType.SetAccessToken,
  { accessToken: string }
>;
export type ClearAccessTokenAction = Action<ActionType.ClearAccessToken>;
export type SetIdTokenAction = ActionWithPayload<
  ActionType.SetIdToken,
  { idToken: string }
>;
export type ClearIdTokenAction = Action<ActionType.ClearIdToken>;

export type AuthenticationAction =
  | SetAccessTokenAction
  | ClearAccessTokenAction
  | SetIdTokenAction
  | ClearIdTokenAction;

export interface AuthenticationDispatchState {
  setAccessToken: (accessToken: string) => void;
  clearAccessToken: () => void;
  setIdToken: (idToken: string) => void;
  clearIdToken: () => void;
}
