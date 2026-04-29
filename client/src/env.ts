import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_APP_NAME: z.string().min(1).default("Tic Tac Toe"),
		VITE_API_URL: z.url().default("http://localhost:3001"),
	},
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true,
});
