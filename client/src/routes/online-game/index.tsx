import { fetchProfile, useCreateRoom, useLoadRooms } from "@/api";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomCard } from "@/rooms/room-card";
import { RoomForm } from "@/rooms/room-form";
import { createFileRoute, redirect } from "@tanstack/react-router";
import type { Room } from "shared/schemas";
import { SymbolText } from "shared/game-symbols";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";

export const Route = createFileRoute("/online-game/")({
	beforeLoad: async () => {
		const exists = await doesSessionExist();
		if (!exists) {
			throw redirect({ to: "/auth" });
		}
	},
	loader: fetchProfile,
	component: RouteComponent,
});

function RouteComponent() {
	const data = Route.useLoaderData();
	const loadRooms = useLoadRooms(data.id);

	const createMutation = useCreateRoom({
		onSuccess: (created) => {
			console.log("Room created successfully", created);
		},
	});

	const rooms = loadRooms.data;
	const handleJoin = (roomId: string) => {
		console.log("Join not yet implemented", roomId);
	};

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="font-heading text-xl mb-4">Create a room</h1>
				<RoomForm
					initialSettings={{
						size: 3,
						toWin: 3,
						name: `${data.nickname}'s Room`,
						symbol: SymbolText.CROSS,
					}}
					onSubmit={createMutation.mutate}
				/>
			</div>

			<Tabs defaultValue="created" className="w-full">
				<TabsList>
					<TabsTrigger value="created">
						{loadRooms.isLoading && <Spinner />} Created
						{rooms?.created.length ? ` (${rooms.created.length})` : ""}
					</TabsTrigger>
					<TabsTrigger value="joined">
						Joined{rooms?.joined.length ? ` (${rooms.joined.length})` : ""}
					</TabsTrigger>
					<TabsTrigger value="free">
						Free{rooms?.free.length ? ` (${rooms.free.length})` : ""}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="created">
					<RoomGrid
						rooms={rooms?.created ?? []}
						emptyText="You haven't created any rooms yet."
					>
						{(room) => (
							<RoomCard
								key={room.id}
								room={room}
								currentUserId={data.id}
								variant="created"
							/>
						)}
					</RoomGrid>
				</TabsContent>

				<TabsContent value="joined">
					<RoomGrid
						rooms={rooms?.joined ?? []}
						emptyText="You haven't joined any rooms yet."
					>
						{(room) => (
							<RoomCard
								key={room.id}
								room={room}
								currentUserId={data.id}
								variant="joined"
							/>
						)}
					</RoomGrid>
				</TabsContent>

				<TabsContent value="free">
					<RoomGrid rooms={rooms?.free ?? []} emptyText="No free rooms available.">
						{(room) => (
							<RoomCard
								key={room.id}
								room={room}
								currentUserId={data.id}
								variant="open"
								onJoin={handleJoin}
							/>
						)}
					</RoomGrid>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function RoomGrid({
	rooms,
	emptyText,
	children,
}: {
	rooms: Room[];
	emptyText: string;
	children: (room: Room) => React.ReactNode;
}) {
	if (rooms.length === 0) {
		return <p className="py-8 text-center text-muted-foreground">{emptyText}</p>;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
			{rooms.map((room) => children(room))}
		</div>
	);
}
