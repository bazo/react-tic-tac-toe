import { Player } from "shared/game-symbols";

export interface Settings {
	size: number;
	toWin: number;
}

export type BoardState = (Player | null)[];

export interface GameWinCheckStrategy {
	checkWin: (boardState: BoardState, currentPlayer: Player, index: number) => boolean;
	getWinningFields: () => number[];
}
