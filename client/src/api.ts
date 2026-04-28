import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateRoomData, UpdateProfileData } from "shared/schemas";
import { env } from "./env";

export interface UserProfile {
	id: string;
	email: string;
	nickname: string;
}

export const profileQueryKey = ["profile"];

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
		},
		onSuccess: (data, variables) => {
			onSuccess?.(data, variables);
			queryClient.invalidateQueries({ queryKey: ["rooms"] });
		},
	});
}
