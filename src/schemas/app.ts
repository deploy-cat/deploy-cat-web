import m from "mongoose";
import { z } from "zod";
import { toMongooseSchema } from "mongoose-zod";

const appZodSchema = z.object({
  name: z.string(),
  image: z.string(),
  host: z.string(),
  user: z.string(),
  port: z.number(),
});

const AppSchema = toMongooseSchema(appZodSchema, {});

const App = m.model("App", AppSchema);

const app = new App().toJSON();
