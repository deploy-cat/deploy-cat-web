"use server";
import { redirect } from "@solidjs/router";
import { useSession } from "vinxi/http";
import { db } from "./db";

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

async function login(username: string, password: string) {
  const user = await db.user.findUnique({ where: { username } });
  if (!user || password !== user.password) throw new Error("Invalid login");
  return user;
}

async function register(username: string, password: string) {
  const existingUser = await db.user.findUnique({ where: { username } });
  if (existingUser) throw new Error("User already exists");
  return db.user.create({
    data: { username: username, password },
  });
}

function getSession() {
  return useSession({
    password:
      process.env.SESSION_SECRET ?? "areallylongsecretthatyoushouldreplace",
  });
}

export const loginFromForm = async (formData: FormData) => {
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));

  try {
    const user = await login(username, password);
    const session = await getSession();
    await session.update((d) => (d.userId = user!.id));
  } catch (err) {
    return err as Error;
  }
  throw redirect("/cloud");
};

export const registerFromForm = async (formData: FormData) => {
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));

  try {
    const user = await register(username, password);
    const session = await getSession();
    await session.update((d) => (d.userId = user!.id));
  } catch (err) {
    return err as Error;
  }
  throw redirect("/cloud");
};

export async function loginOrRegister(formData: FormData) {
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));
  const loginType = String(formData.get("loginType"));
  let error = validateUsername(username) || validatePassword(password);
  if (error) return new Error(error);

  try {
    const user = await (loginType !== "login"
      ? register(username, password)
      : login(username, password));
    const session = await getSession();
    await session.update((d) => (d.userId = user!.id));
  } catch (err) {
    return err as Error;
  }
  throw redirect("/cloud");
}

export async function logout() {
  const session = await getSession();
  await session.update((d) => (d.userId = undefined));
  throw redirect("/");
}

export async function getUser() {
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) throw redirect("/");

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw redirect("/");
    return { id: user.id, username: user.username };
  } catch (e) {
    throw logout();
  }
}
