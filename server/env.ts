import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
	server: {
		VITE_APP_NAME: z.string().min(1).default("Tic Tac Toe"),
		VITE_API_URL: z.url().default("http://localhost"),
		API_HOST: z.string().default("0.0.0.0"),
		API_PORT: z.int().default(3001),
		WEBSITE_DOMAIN: z.url().default("http://localhost:5173"),
		SUPERTOKENS_CONNECTION_URI: z.url(),
		SUPERTOKENS_API_KEY: z.string().optional(),
		GOOGLE_CLIENT_ID: z.string().optional(),
		GOOGLE_CLIENT_SECRET: z.string().optional(),
		GITHUB_CLIENT_ID: z.string().optional(),
		GITHUB_CLIENT_SECRET: z.string().optional(),
		DATABASE_URL: z.string().default("tic-tac-toe.db"),
		TURSO_AUTH_TOKEN: z.string().optional(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
