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
import { CreateRoomSchema, UpdateProfileSchema } from "shared/schemas";
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
	methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"],
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
		const userId = request.session!.getUserId();
		const stUser = await supertokens.getUser(userId);
		if (!stUser) {
			return { status: "error" };
		}
		const email = stUser.emails[0];

		const existing = await db.user.findUnique({ where: { id: userId } });
		if (existing) {
			if (existing.email !== email) {
				await db.user.update({ where: { id: userId }, data: { email } });
			}
			return { status: "ok" };
		}

		const base = email.split("@")[0];
		let nickname = base;
		const taken = await db.user.findUnique({ where: { nickname } });
		if (taken) {
			nickname = `${base}${Math.floor(Math.random() * 10000)}`;
		}

		await db.user.create({ data: { id: userId, email, nickname } });
		return { status: "ok" };
	},
});

server.get("/api/me", {
	preHandler: async (request, reply) => {
		return verifySession()(request, reply);
	},
	handler: async (request: SessionRequest, reply) => {
		const userId = request.session!.getUserId();
		const user = await db.user.findUnique({ where: { id: userId } });

		if (!user) {
			return reply.code(404).send({ error: "User not found" });
		}

		return { id: user.id, email: user.email, nickname: user.nickname };
	},
});

server.put("/api/me", {
	preHandler: async (request, reply) => {
		return verifySession()(request, reply);
	},
	handler: async (request: SessionRequest, reply) => {
		const userId = request.session!.getUserId();
		const parsed = UpdateProfileSchema.safeParse(request.body);

		if (!parsed.success) {
			return reply
				.code(400)
				.send({ error: "Invalid input", details: parsed.error.flatten() });
		}

		const { nickname } = parsed.data;

		const existing = await db.user.findUnique({ where: { nickname } });
		if (existing && existing.id !== userId) {
			return reply.code(409).send({ error: "Nickname already taken" });
		}

		const user = await db.user.update({
			where: { id: userId },
			data: { nickname },
		});

		return { id: user.id, email: user.email, nickname: user.nickname };
	},
});

server.get("/api/rooms", {
	preHandler: async (request, reply) => {
		return verifySession()(request, reply);
	},
	handler: async (request: SessionRequest, _reply) => {
		const session = request.session!;
		return db.room.findMany({
			where: {
				OR: [
					{ creatorId: session.getUserId() },
					{ opponentId: session.getUserId() },
					{ opponentId: null },
				],
			},
			include: {
				creator: { select: { nickname: true } },
				opponent: { select: { nickname: true } },
			},
		});
	},
});

server.post("/api/rooms", {
	preHandler: async (request, reply) => {
		return verifySession()(request, reply);
	},
	handler: async (request: SessionRequest, reply) => {
		const session = request.session!;
		const body = CreateRoomSchema.parse(JSON.parse(request.body));

		const owner = await db.user.findUnique({ where: { id: session.getUserId() } });
		if (!owner) {
			return reply
				.code(400)
				.header("Content-Type", "application/json; charset=utf-8")
				.send({ error: "Owner not found" });
		}

		const room = await db.room.create({
			data: {
				name: body.name,
				size: body.size,
				toWin: body.toWin,
				creatorId: owner.id,
				creatorSymbol: body.symbol,
			},
		});

		return room;
	},
});

await server.listen({ port: env.VITE_API_PORT, host: env.VITE_API_HOST });
console.log(`Server running on ${env.VITE_API_URL}`);
