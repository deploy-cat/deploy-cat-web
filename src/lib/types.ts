import { z } from "zod";

export const schemaDatabse = z.object({
  name: z.string().min(3).max(32),
  init: z
    .object({
      database: z.string().min(2).max(32),
      owner: z.string().min(2).max(32),
    })
    .optional(),
  instances: z.number().int().positive().max(8),
  size: z.number().int().positive().max(64),
});

export interface Database extends z.infer<typeof schemaDatabse> {}

export const schemaUser = z.object({
  name: z.string(),
  id: z.string().optional(),
  email: z.string().optional(),
  image: z.string().optional(),
});

export interface User extends z.infer<typeof schemaUser> {}
