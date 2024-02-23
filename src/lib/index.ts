import { action, cache } from "@solidjs/router";
import { getUser as gU, loginFromForm, registerFromForm } from "./server";

export const getUser = cache(gU, "user");
// export const loginOrRegister = action(lOR, "loginOrRegister");
export const login = action(loginFromForm, "login");
export const register = action(registerFromForm, "register");
// export const logout = action(l, "logout");
