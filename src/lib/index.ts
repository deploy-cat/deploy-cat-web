import { action, cache } from "@solidjs/router";
import { loginFromForm, registerFromForm } from "./server";
import { getUser as gU } from "./auth";

export const getUser = cache(gU, "user");
// export const loginOrRegister = action(lOR, "loginOrRegister");
export const login = action(loginFromForm, "login");
export const register = action(registerFromForm, "register");
// export const logout = action(l, "logout");
