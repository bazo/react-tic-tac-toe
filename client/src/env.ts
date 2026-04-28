import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_APP_NAME: z.string().min(1),
		VITE_API_DOMAIN: z.url(),
		VITE_WEBSITE_DOMAIN: z.url(),
	},
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true,
});
