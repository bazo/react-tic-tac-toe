import { Player, SymbolText } from "../game-symbols";
import type { Game } from "../schemas";
import { isBoardFilled } from "./functions";
import XToWinStrategy from "./strategies/x-to-win-strategy";

export function getPlayerData(game: NonNullable<Game>) {
	const creatorPlayer = game.creatorSymbol === SymbolText.CROSS ? Player.CROSS : Player.CIRCLE;
	return {
		[game.creator.id]: {
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
	if (game.winner || game.draw) {
		throw new Error("game_finished", {
			cause: `winner=${game.winner?.id} draw=${game.draw ? "true" : "false"}`,
		});
	}

	if (game.currentPlayer.id !== playerId) {
		throw new Error("not_your_turn", {
			cause: `currentPlayerId=${game.currentPlayer.id} playerId=${playerId}`,
		});
	}

	const playerData = getPlayerData(game);
	const nextBoardState = [...game.state];

	if (playerData[playerId]) {
		let winnerId: string | null = null;
		let draw = false;
		const player = playerData[playerId].player;
		if (typeof nextBoardState[index] === "string" && symbols.includes(nextBoardState[index])) {
			throw new Error("square_already_filled", {
				cause: `board[${index}]=${game.state[index]}`,
			});
		}
		nextBoardState[index] = player;

		const strategy = XToWinStrategy(game.size, game.toWin);

		const isWin = strategy.checkWin(nextBoardState, player, index);
		let winningFields: number[] = [];

		if (isWin) {
			winnerId = playerId;
			winningFields = strategy.getWinningFields();
		} else {
			if (isBoardFilled(nextBoardState)) {
				draw = true;
			}
		}

		const nextPlayerId = Object.keys(playerData).find((id) => id !== playerId);

		return { nextBoardState, nextPlayerId: nextPlayerId!, winnerId, winningFields, draw };
	}

	throw new Error("player_data_not_found");
}
