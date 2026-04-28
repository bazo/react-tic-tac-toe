import z from "zod";

export const CreateRoomSchema = z
	.object({
		name: z.string().min(5).max(100),
		size: z.number().min(3).max(99),
		toWin: z.number().min(3),
	})
	.superRefine((value, ctx) => {
		const { size, toWin } = value;
		if (toWin > size) {
			ctx.addIssue({
				code: "too_big",
				maximum: size,
				origin: "number",
				//inclusive: true,
				message: "To win must be less than or equal to size",
				input: value,
				path: ["toWin"],
			});
		}
	});

export type CreateRoomData = z.infer<typeof CreateRoomSchema>;
