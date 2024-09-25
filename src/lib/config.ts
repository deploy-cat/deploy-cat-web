import { z } from "zod";
import fs from "fs/promises";
import merge from "deepmerge";
import { isServer } from "solid-js/web";
import x from "../../dist/public/assets/user-bdc93350";

const configPath = process.cwd?.() && `${process.cwd()}/config.json`;

const schemaConfig = z.object({
  database: z.object({
    url: z.string(),
  }),
  kubeconfig: z
    .object({
      base64: z.string().optional(),
      path: z.string().optional(),
      fromcluster: z.boolean().optional(),
    })
    .optional(),
  prometheus: z.object({
    url: z.string(),
  }),
  auth: z.object({
    github: z
      .object({
        id: z.string(),
        secret: z.string(),
      })
      .optional(),
    credentials: z
      .object({
        enable: z.boolean(),
      })
      .optional(),
  }),
});

const parseEnv = ({ prefix = "", envs = process.env ?? {} } = {}) => {
  const parsed = {} as any;
  Object.entries(envs)
    .filter(([key]) => key?.startsWith(prefix.toUpperCase()))
    .forEach(([key, value]) => {
      const seq = (obj: any, arr: Array<string>, v: string | undefined) => {
        if (typeof obj === "string") return;
        if (arr.length > 1) {
          const [pos] = arr.splice(0, 1);
          if (!obj[pos]) obj[pos] = {};
          seq(obj[pos], arr, v);
        } else {
          obj[arr[0]] = v;
        }
      };
      const keyArr = key.split("_").map((e) => e.toLocaleLowerCase());
      seq(parsed, keyArr, value);
    });
  return prefix !== "" ? parsed?.[prefix] ?? {} : parsed;
};

const parseJSON = async () => {
  if (!configPath) return {};
  try {
    return JSON.parse((await fs.readFile(configPath)).toString());
  } catch (e) {
    console.info("no json config found, get config only from envs");
    return {};
  }
};

const getConfig = async () => {
  const config = merge(await parseJSON(), parseEnv({ prefix: "deploycat" }));
  console.log("config:", config);
  return config;
};

export const config = isServer ? schemaConfig.parse(await getConfig()) : null;
