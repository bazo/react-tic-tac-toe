import { Player } from "shared/game-symbols";

export interface Settings {
	size: number;
	toWin: number;
}

export type BoardState = (Player | undefined)[];

export interface GameWinCheckStrategy {
	checkWin: (boardState: BoardState, currentPlayer: Player, index: number) => boolean;
	getWinningFields: () => number[];
}

export const squareSize = 48;
