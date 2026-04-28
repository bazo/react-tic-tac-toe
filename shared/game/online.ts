import { Player, SymbolText } from "../game-symbols";
import type { Game } from "../schemas";
import type { BoardState } from "./types";

export function getPlayerData(game: NonNullable<Game>) {
	const creatorPlayer = game.creatorSymbol === SymbolText.CROSS ? Player.CROSS : Player.CIRCLE;
	return {
		[game.creatorId]: {
			symbol: game.creatorSymbol,
			player: creatorPlayer,
		},
		[game.opponent.id]: {
			symbol: game.creatorSymbol === SymbolText.CROSS ? SymbolText.CIRCLE : SymbolText.CROSS,
			player: creatorPlayer === Player.CROSS ? Player.CIRCLE : Player.CROSS,
		},
	};
}

const symbols = [Player.CROSS, Player.CIRCLE];

export function getNextBoardState({
	game,
	index,
	playerId,
}: {
	game: Game;
	index: number;
	playerId: string;
}) {
	if (game.currentPlayer.id !== playerId) {
		throw new Error("not_your_turn", {
			cause: `currentPlayerId=${game.currentPlayer.id} playerId=${playerId}`,
		});
	}

	const playerData = getPlayerData(game);
	const nextBoardState = [...game.state];

	if (playerData[playerId]) {
		const player = playerData[playerId].player;
		if (typeof nextBoardState[index] === "string" && symbols.includes(nextBoardState[index])) {
			throw new Error("square_already_filled", {
				cause: `board[${index}]=${game.state[index]}`,
			});
		}
		nextBoardState[index] = player;
	}

	const nextPlayerId = Object.keys(playerData).find((id) => id !== playerId);

	return { nextBoardState, nextPlayerId: nextPlayerId! };
}
