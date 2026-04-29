import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	GameSchema,
	GamesResponseSchema,
	type CreateGameData,
	type GamePreview,
	type UpdateProfileData,
} from "shared/schemas";
import { env } from "./env";
import Game from "./game/game";

export interface UserProfile {
	id: string;
	email: string;
	nickname: string;
}

export const profileQueryKey = ["profile"];
export const gamesQueryKey = ["games"];

export async function fetchProfile() {
	const res = await fetch(`${env.VITE_API_URL}/api/me`);
	if (!res.ok) {
		throw new Error("Failed to fetch profile");
	}

	const json = await res.json();
	console.log(json);
	return json as UserProfile;
}

export function useProfile(enabled = true) {
	return useQuery<UserProfile>({
		queryKey: profileQueryKey,
		queryFn: async () => {
			const res = await fetch(`${env.VITE_API_URL}/api/me`);
			if (!res.ok) throw new Error("Failed to fetch profile");
			return res.json();
		},
		enabled,
	});
}

export function useUpdateProfile({ onSuccess }: { onSuccess?: () => void } = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: UpdateProfileData) => {
			const res = await fetch(`${env.VITE_API_URL}/api/me`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error ?? "Failed to update profile");
			}
			return res.json() as Promise<UserProfile>;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: profileQueryKey });
			onSuccess?.();
		},
	});
}

export function useCreateGame({
	onSuccess,
}: { onSuccess?: (data: void, variables: CreateGameData) => void } = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (gameData: CreateGameData) => {
			const res = await fetch(`${env.VITE_API_URL}/api/games`, {
				method: "POST",
				body: JSON.stringify(gameData),
			});
			const json = await res.json();
			console.log(json);
		},
		onSuccess: (data, variables) => {
			onSuccess?.(data, variables);
			queryClient.invalidateQueries({ queryKey: ["games"] });
		},
	});
}

export function useJoinGame({ onSuccess }: { onSuccess?: (data: void) => void } = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (gameId: string) => {
			const res = await fetch(`${env.VITE_API_URL}/api/games/${gameId}`, {
				method: "POST",
			});
			const json = await res.json();
			console.log(json);
		},
		onSuccess: (data) => {
			onSuccess?.(data);
			queryClient.invalidateQueries({ queryKey: ["games"] });
		},
	});
}

export function useLoadGames(userId: string) {
	return useQuery({
		queryKey: gamesQueryKey,
		queryFn: async () => {
			const res = await fetch(`${env.VITE_API_URL}/api/games`);
			if (!res.ok) {
				throw new Error("Failed to fetch games");
			}
			const json = await res.json();
			const parsed = GamesResponseSchema.safeParse(json);

			if (!parsed.success) {
				console.log(parsed.error.message);
				throw parsed.error;
			}

			const games = {
				created: [] as GamePreview[],
				joined: [] as GamePreview[],
				free: [] as GamePreview[],
				past: [] as GamePreview[],
			};
			(parsed.data || []).forEach((game) => {
				if (game.creator.id === userId && (game.winner === null || game.draw)) {
					games.created.push(game);
				}

				if (game.opponent?.id === userId && (game.winner === null || game.draw)) {
					games.joined.push(game);
				}

				if (!game.opponent?.id && game.creator.id !== userId) {
					games.free.push(game);
				}

				if (game.winner || game.draw) {
					games.past.push(game);
				}
			});

			return games;
		},
	});
}

export async function loadGame(gameId: string) {
	const res = await fetch(`${env.VITE_API_URL}/api/games/${gameId}`);
	if (!res.ok) {
		throw new Error("Failed to load game");
	}
	const json = await res.json();

	const parsed = GameSchema.safeParse(json);
	if (parsed.error) {
		console.error(parsed.error);
		throw parsed.error;
	}
	return parsed.data;
}
