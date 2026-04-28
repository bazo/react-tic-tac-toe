import { useCreateRoom } from "@/api";
import { RoomForm } from "@/rooms/room-form";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
	doesSessionExist,
	getUserId,
} from "supertokens-auth-react/recipe/session";

export const Route = createFileRoute("/online-game/")({
	beforeLoad: async () => {
		const exists = await doesSessionExist();
		if (!exists) {
			throw redirect({ to: "/auth" });
		}
	},
	loader: async () => {
		const userId = await getUserId();
		return { userId };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const data = Route.useLoaderData();

	const mutation = useCreateRoom({
		onSuccess: (data) => {	
			console.log("Room created successfully", data);
			// You can redirect to the room page here, e.g.:
			// navigate(`/rooms/${data.roomId}`);
			// For now, we'll just log the response.	
		}
	});

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h1 className="text-xl text-balance">Create a room</h1>
				<RoomForm
					initialSettings={{
						size: 3,
						toWin: 3,
						name: `${data.userId}'s Room`,
					}}
					onSubmit={mutation.mutate}
				/>
			</div>
			<div>
				<h1 className="text-xl text-balance">Join a room</h1>
			</div>
		</div>
	);
}
