import { SolidAuth } from "@solid-mediakit/auth";
import { getAuthOptions } from "~/lib/auth";

export const { GET, POST } = SolidAuth(getAuthOptions());
