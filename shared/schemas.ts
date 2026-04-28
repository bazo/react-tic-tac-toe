import z from "zod";
import { SymbolText } from "./game-symbols";

export const CreateRoomSchema = z
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

export type CreateRoomData = z.infer<typeof CreateRoomSchema>;

export const UpdateProfileSchema = z.object({
	email: z.email(),
	nickname: z.string().min(4).max(30),
});

export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>;

export const RoomPlayerSchema = z.object({
	nickname: z.string(),
});

export const RoomSchema = z.object({
	id: z.string(),
	name: z.string(),
	size: z.number(),
	toWin: z.number(),
	creatorId: z.string(),
	opponentId: z.string().nullable(),
	creatorSymbol: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	creator: RoomPlayerSchema,
	opponent: RoomPlayerSchema.nullable(),
});
export type Room = z.infer<typeof RoomSchema>;

export const RoomsResponseSchema = z.array(RoomSchema);
export type RoomsResponse = z.infer<typeof RoomsResponseSchema>;
