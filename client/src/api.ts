import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateRoomSchema, type CreateRoomData } from "shared/schemas";
import { env } from "./env";

export function useCreateRoom({
	onSuccess,
}: { onSuccess?: (data: void, variables: CreateRoomData) => void } = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (roomData: CreateRoomData) => {
			const res = await fetch(`${env.VITE_API_URL}/api/rooms`, {
				method: "POST",
				body: JSON.stringify(roomData),
			});
			const json = await res.json();
			console.log(json);
			//return CreateRoomResponseSchema.parse(json);
		},
		onSuccess: (data, variables) => {
			onSuccess?.(data, variables);
			queryClient.invalidateQueries({ queryKey: ["rooms"] });
		},
	});
}
