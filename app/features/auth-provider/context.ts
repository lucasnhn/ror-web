import { createContext } from "react";
import type { AuthenticationDispatchState, AuthenticationState } from "./types";

export const AuthContext = createContext<AuthenticationState | null>(null);
export const AuthDispatchContext =
  createContext<AuthenticationDispatchState | null>(null);
