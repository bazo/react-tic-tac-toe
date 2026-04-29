import { createFileRoute, redirect } from "@tanstack/react-router";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";

import { fetchProfile, loadGame } from "@/api";
import { useOnlineGame } from "@/games/online/use-online-game";

export const Route = createFileRoute("/online-game/$gameId")({
	beforeLoad: async () => {
		const exists = await doesSessionExist();
		if (!exists) {
			throw redirect({ to: "/auth" });
		}
	},
	loader: async ({ params }) => {
		const { gameId } = params;
		if (!gameId) {
			throw redirect({ to: "/online-game" });
		}
		const profile = await fetchProfile();
		const game = await loadGame(gameId);

		return { profile, game };
	},
	component: OnlineGamePage,
});

function OnlineGamePage() {
	const { profile, game } = Route.useLoaderData();

	const {
		board: Board,
		canPlay,
		opponentNickname,
		winner,
		isDraw,
	} = useOnlineGame({
		game,
		playerId: profile.id,
	});

	return (
		<div className="mx-auto">
			<div className="flex items-center gap-4 align-bottom">
				<div className="text-3xl">{game.name}</div>
				<div className="text-xl">
					size: {game.size} to win: {game.toWin}
				</div>
			</div>
			{winner
				? winner.id === profile.id
					? "You are the winner"
					: `Winner is ${winner.nickname}`
				: isDraw
					? "Draw"
					: canPlay
						? "Your turn!"
						: `Waiting for ${opponentNickname}...`}
			<Board />
		</div>
	);
}
