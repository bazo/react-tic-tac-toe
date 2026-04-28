import Fastify from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import supertokens from "supertokens-node";
import {
	plugin as supertokensPlugin,
	errorHandler as supertokensErrorHandler,
} from "supertokens-node/framework/fastify";
import { verifySession } from "supertokens-node/recipe/session/framework/fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";
import { env } from "./env";
import { supertokensConfig } from "./supertokens";
import { createDbConnection } from "./db/client";

supertokens.init(supertokensConfig);

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

const db = await createDbConnection(env.DATABASE_URL, env.TURSO_AUTH_TOKEN);

server.post("/api/me", {
	preHandler: async (request, reply) => {
		return verifySession()(request, reply);
	},
	handler: async (request: SessionRequest, _reply) => {
		const session = request.session!;
		console.log(session)
		// db.user.create({
		// 	data: {
		// 		id: session.getUserId(),
		// 		email: session.
		// 	}
		// })

		return { userId: session.getUserId() };
	},
});

server.get("/api/me", {
	preHandler: async (request, reply) => {
		return verifySession()(request, reply);
	},
	handler: async (request: SessionRequest, _reply) => {
		const session = request.session!;
		return { userId: session.getUserId() };
	},
});



server.get("/api/rooms", {
	preHandler: async (request, reply) => {
		return verifySession()(request, reply);
	},
	handler: async (request: SessionRequest, _reply) => {
		const session = request.session!;
		return { userId: session.getUserId() };
	},
});

server.post("/api/rooms", {
	preHandler: async (request, reply) => {
		return verifySession()(request, reply);
	},
	handler: async (request: SessionRequest, _reply) => {
		const session = request.session!;
		console.log(session)
		return { userId: session.getUserId() };
	},
});

await server.listen({ port: env.VITE_API_PORT, host: env.VITE_API_HOST });
console.log(`Server running on ${env.VITE_API_URL}`);
