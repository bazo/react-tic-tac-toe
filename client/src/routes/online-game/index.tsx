import { createFileRoute, redirect } from "@tanstack/react-router";
import { SymbolText } from "shared/game-symbols";
import type { GamePreview } from "shared/schemas";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";

import { fetchProfile, useCreateGame, useJoinGame, useLoadGames } from "@/api";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameCard } from "@/games/components/game-card";
import { GameForm } from "@/games/components/game-form";

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
	const loadGames = useLoadGames(data.id);

	const createMutation = useCreateGame({
		onSuccess: (created) => {
			console.log("Game created successfully", created);
		},
	});

	const joinMutation = useJoinGame({
		onSuccess: (joined) => {
			console.log("Joined game successfully", joined);
		},
	});

	const games = loadGames.data;
	const handleJoin = (gameId: string) => {
		joinMutation.mutate(gameId);
	};

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="font-heading text-xl mb-4">Create a game</h1>
				<GameForm
					initialSettings={{
						size: 3,
						toWin: 3,
						name: `${data.nickname}'s Game`,
						symbol: SymbolText.CROSS,
					}}
					onSubmit={createMutation.mutate}
				/>
			</div>

			<Tabs defaultValue="created" className="w-full">
				<TabsList>
					<TabsTrigger value="created">
						{loadGames.isLoading && <Spinner />} Created
						{games?.created.length ? ` (${games.created.length})` : ""}
					</TabsTrigger>
					<TabsTrigger value="joined">
						Joined
						{games?.joined.length ? ` (${games.joined.length})` : ""}
					</TabsTrigger>
					<TabsTrigger value="free">
						Free
						{games?.free.length ? ` (${games.free.length})` : ""}
					</TabsTrigger>
					<TabsTrigger value="past">
						Past
						{games?.past.length ? ` (${games.past.length})` : ""}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="created">
					<GameGrid
						games={games?.created ?? []}
						emptyText="You haven't created any games yet."
					>
						{(game) => (
							<GameCard
								key={game.id}
								game={game}
								currentUserId={data.id}
								variant="created"
							/>
						)}
					</GameGrid>
				</TabsContent>

				<TabsContent value="joined">
					<GameGrid
						games={games?.joined ?? []}
						emptyText="You haven't joined any games yet."
					>
						{(game) => (
							<GameCard
								key={game.id}
								game={game}
								currentUserId={data.id}
								variant="joined"
							/>
						)}
					</GameGrid>
				</TabsContent>

				<TabsContent value="free">
					<GameGrid games={games?.free ?? []} emptyText="No free games available.">
						{(game) => (
							<GameCard
								key={game.id}
								game={game}
								currentUserId={data.id}
								variant="open"
								onJoin={handleJoin}
								isJoining={
									joinMutation.isPending && joinMutation.variables === game.id
								}
							/>
						)}
					</GameGrid>
				</TabsContent>

				<TabsContent value="past">
					<GameGrid
						games={games?.past ?? []}
						emptyText="You don't have any past games yet."
					>
						{(game) => (
							<GameCard
								key={game.id}
								game={game}
								currentUserId={data.id}
								variant="past"
							/>
						)}
					</GameGrid>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function GameGrid({
	games,
	emptyText,
	children,
}: {
	games: GamePreview[];
	emptyText: string;
	children: (game: GamePreview) => React.ReactNode;
}) {
	if (games.length === 0) {
		return <p className="py-8 text-center text-muted-foreground">{emptyText}</p>;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
			{games.map((game) => children(game))}
		</div>
	);
}
