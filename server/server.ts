import Fastify from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import supertokens from "supertokens-node";
import {
	plugin as supertokensPlugin,
	errorHandler as supertokensErrorHandler,
} from "supertokens-node/framework/fastify/index.js";
import { verifySession } from "supertokens-node/recipe/session/framework/fastify/index.js";
import Session from "supertokens-node/recipe/session/index.js";
import EmailPassword from "supertokens-node/recipe/emailpassword/index.js";
import ThirdParty from "supertokens-node/recipe/thirdparty/index.js";
import { env } from "./env.ts";

supertokens.init({
	framework: "fastify",
	supertokens: {
		connectionURI: env.SUPERTOKENS_CONNECTION_URI,
		apiKey: env.SUPERTOKENS_API_KEY,
	},
	appInfo: {
		appName: env.VITE_APP_NAME,
		apiDomain: env.VITE_API_DOMAIN,
		websiteDomain: env.VITE_WEBSITE_DOMAIN,
		apiBasePath: "/auth",
		websiteBasePath: "/auth",
	},
	recipeList: [
		EmailPassword.init(),
		ThirdParty.init({
			signInAndUpFeature: {
				providers: [
					{
						config: {
							thirdPartyId: "google",
							clients: [
								{
									clientId:
										env.GOOGLE_CLIENT_ID ?? "",
									clientSecret:
										env.GOOGLE_CLIENT_SECRET ?? "",
								},
							],
						},
					},
					{
						config: {
							thirdPartyId: "github",
							clients: [
								{
									clientId:
										env.GITHUB_CLIENT_ID ?? "",
									clientSecret:
										env.GITHUB_CLIENT_SECRET ?? "",
								},
							],
						},
					},
				],
			},
		}),
		Session.init(),
	],
});

const server = Fastify();

await server.register(cors, {
	origin: (origin, cb) => {
		if (
			!origin ||
			origin.startsWith("http://localhost:") ||
			origin === env.VITE_WEBSITE_DOMAIN
		) {
			cb(null, true);
		} else {
			cb(new Error("Not allowed by CORS"), false);
		}
	},
	credentials: true,
	allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
});
await server.register(formbody);
await server.register(supertokensPlugin);

server.setErrorHandler(supertokensErrorHandler());

server.get("/api/me", {
	preHandler: verifySession() as any,
	handler: async (request, _reply) => {
		const session = (request as any).session;
		return { userId: session.getUserId() };
	},
});

const port = Number(new URL(env.VITE_API_DOMAIN).port) || 3001;

await server.listen({ port, host: "0.0.0.0" });
console.log(`Server running on ${env.VITE_API_DOMAIN}`);
