import { SolidAuth } from "@solid-mediakit/auth";
import { authOptions } from "~/lib/auth";

export const { GET, POST } = SolidAuth(authOptions);
