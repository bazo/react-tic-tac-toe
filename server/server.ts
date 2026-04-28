import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import supertokens from "supertokens-node";
import {
	plugin as supertokensPlugin,
	errorHandler as supertokensErrorHandler,
} from "supertokens-node/framework/fastify";
import { verifySession } from "supertokens-node/recipe/session/framework/fastify";
import Session from "supertokens-node/recipe/session";
import type { SessionRequest } from "supertokens-node/framework/fastify";
import {
	CreateGameSchema,
	PlayerMoveSchema,
	GameSchema,
	UpdateProfileSchema,
} from "shared/schemas";
import { env } from "./env";
import { supertokensConfig } from "./supertokens";
import { createDbConnection } from "./db/client";
import websocket from "@fastify/websocket";
import { createBoard } from "shared/game/functions";
import { getNextBoardState } from "shared/game/online";
import z from "zod";
import { RoomManager } from "./room-manager";
supertokens.init(supertokensConfig);

const server = Fastify();
await server.register(cookie);
await server.register(websocket);

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

server.get("/api/games", {
	preHandler: async (request, reply) => {
		return verifySession()(request, reply);
	},
	handler: async (request: SessionRequest, _reply) => {
		const session = request.session!;
		return db.game.findMany({
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

server.post("/api/games", {
	preHandler: async (request, reply) => {
		return verifySession()(request, reply);
	},
	handler: async (request: SessionRequest, reply) => {
		const session = request.session!;
		const body = CreateGameSchema.parse(JSON.parse(request.body));

		const owner = await db.user.findUnique({ where: { id: session.getUserId() } });
		if (!owner) {
			return reply
				.code(400)
				.header("Content-Type", "application/json; charset=utf-8")
				.send({ error: "Owner not found" });
		}

		const game = await db.game.create({
			data: {
				name: body.name,
				size: body.size,
				toWin: body.toWin,
				creatorId: owner.id,
				creatorSymbol: body.symbol,
			},
		});

		return game;
	},
});

server.post("/api/games/:gameId", {
	preHandler: async (request, reply) => {
		return verifySession()(request, reply);
	},
	handler: async (request: SessionRequest, reply) => {
		const session = request.session!;

		//@ts-ignore - supertokens types are wrong about this
		const { gameId } = request.params;

		let game = await db.game.findUnique({ where: { id: gameId } });

		if (!game) {
			return reply
				.code(400)
				.header("Content-Type", "application/json; charset=utf-8")
				.send({ error: "Game not found" });
		}

		const user = await db.user.findUnique({ where: { id: session.getUserId() } });
		if (!user) {
			return reply
				.code(400)
				.header("Content-Type", "application/json; charset=utf-8")
				.send({ error: "User not found" });
		}

		const board = createBoard(game.size);

		return db.game.update({
			where: { id: gameId },
			data: {
				opponentId: user.id,
				state: JSON.stringify(board),
				currentPlayerId: game.creatorSymbol === "X" ? game.creatorId : user.id,
			},
		});
	},
});

server.get("/api/games/:gameId", {
	preHandler: async (request, reply) => {
		return verifySession()(request, reply);
	},
	handler: async (request: SessionRequest, reply) => {
		//@ts-ignore - supertokens types are wrong about this
		const { gameId } = request.params;

		let game = await db.game.findUnique({
			where: { id: gameId },
			include: {
				creator: { select: { id: true, nickname: true } },
				opponent: { select: { id: true, nickname: true } },
				currentPlayer: { select: { id: true, nickname: true } },
			},
		});

		if (!game) {
			return reply
				.code(400)
				.header("Content-Type", "application/json; charset=utf-8")
				.send({ error: "Game not found" });
		}

		return game;
	},
});

const rooms = new RoomManager();

server.get("/ws/:gameId", { websocket: true }, async function wsHandler(socket, request) {
	const accessToken = request.cookies.sAccessToken;

	if (!accessToken) {
		socket.close(1008, "Unauthorized");
		return;
	}

	let session;
	try {
		session = await Session.getSessionWithoutRequestResponse(accessToken, undefined, {
			sessionRequired: false,
			antiCsrfCheck: false,
		});
	} catch {
		session = undefined;
	}

	if (!session) {
		socket.close(1008, "Unauthorized");
		return;
	}
	//@ts-ignore
	const { gameId } = request.params;
	const userId = session.getUserId();
	console.log("ws connected", { userId, gameId });

	rooms.addClientToRoom(gameId, socket);

	socket.on("message", async (message) => {
		console.log({ userId, gameId, message: message.toString() });

		const gameRow = await db.game.findUnique({
			where: { id: gameId },
			include: {
				creator: { select: { id: true, nickname: true } },
				opponent: { select: { id: true, nickname: true } },
				currentPlayer: { select: { id: true, nickname: true } },
			},
		});

		if (!gameRow) {
			socket.send(
				JSON.stringify({
					type: "error",
					error: "game_not_found",
				}),
			);
			return;
		}
		const game = GameSchema.parse(gameRow);
		const move = PlayerMoveSchema(game?.state?.length ?? 0).safeParse(
			JSON.parse(message.toString()),
		);
		if (!move.success) {
			socket.send(
				JSON.stringify({
					type: "error",
					error: "invalid_move_data",
					details: z.treeifyError(move.error),
				}),
			);
			return;
		}

		if (game.currentPlayer.id !== userId) {
			socket.send(JSON.stringify({ type: "error", error: "not_your_turn" }));
			return;
		}

		try {
			const { nextBoardState, nextPlayerId } = getNextBoardState({
				game,
				index: move.data.index,
				playerId: userId,
			});

			await db.game.update({
				where: { id: gameId },
				data: {
					state: JSON.stringify(nextBoardState),
					currentPlayerId: nextPlayerId,
				},
			});
			rooms.broadcastToRoom(
				gameId,
				JSON.stringify({ type: "update", nextBoardState, nextPlayerId }),
			);
		} catch (error) {
			socket.send(
				JSON.stringify({ type: "error", error: error.message, details: error.cause }),
			);
		}
	});
});

await server.listen({ port: env.VITE_API_PORT, host: env.VITE_API_HOST });
console.log(`Server running on ${env.VITE_API_URL}`);
