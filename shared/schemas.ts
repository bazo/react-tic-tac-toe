import z from "zod";
import { Player, SymbolText } from "./game-symbols";
import type { BoardState } from "./game/types";

export const CreateGameSchema = z
	.object({
		name: z.string().min(5).max(100),
		size: z.number().min(3).max(99),
		toWin: z.number().min(3),
		symbol: z.enum([SymbolText.CROSS, SymbolText.CIRCLE]),
	})
	.superRefine((value, ctx) => {
		const { size, toWin } = value;
		if (toWin > size) {
			ctx.addIssue({
				code: "too_big",
				maximum: size,
				origin: "number",
				message: "To win must be less than or equal to size",
				input: value,
				path: ["toWin"],
			});
		}
	});

export type CreateGameData = z.infer<typeof CreateGameSchema>;

export const UpdateProfileSchema = z.object({
	nickname: z.string().min(4).max(30),
});

export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>;

export const GamePlayerBaseSchema = z.object({
	nickname: z.string(),
});

export const GamePlayerSchema = z.object({
	id: z.string(),
	nickname: z.string(),
});

export const GamePreviewSchema = z.object({
	id: z.string(),
	name: z.string(),
	size: z.number(),
	toWin: z.number(),
	creatorId: z.string(),
	opponentId: z.string().nullable(),
	creatorSymbol: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	creator: GamePlayerBaseSchema,
	opponent: GamePlayerBaseSchema.nullable(),
});
export type GamePreview = z.infer<typeof GamePreviewSchema>;

export const GamesResponseSchema = z.array(GamePreviewSchema);
export type GamesResponse = z.infer<typeof GamesResponseSchema>;

export const GameSchema = GamePreviewSchema.extend({
	creator: GamePlayerSchema,
	opponent: GamePlayerSchema,
	state: z.json().transform((json) => JSON.parse(json?.toString() || "[]") as BoardState),
	currentPlayer: GamePlayerSchema,
});

export type Game = z.infer<typeof GameSchema>;

export const PlayerMoveSchema = (max: number) =>
	z.object({
		index: z
			.number()
			.min(0)
			.max(max - 1),
	});

export const GameErrorSchema = z.object({
	type: z.literal("error"),
	error: z.string(),
	details: z.any().optional(),
});

export const GameUpdateSchema = z.object({
	type: z.literal("update"),
	nextBoardState: z
		.array(z.union([z.literal(Player.CROSS), z.literal(Player.CIRCLE), z.null()]))
		.max(Math.pow(99, 2)),
	nextPlayerId: z.string(),
});

export const GameMoveResultSchema = z.discriminatedUnion("type", [
	GameErrorSchema,
	GameUpdateSchema,
]);
