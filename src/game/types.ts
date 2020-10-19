export enum SymbolText {
	CROSS = "×",
	CIRCLE = "○",
	EMPTY = "",
}

export enum Player {
	CROSS = "0",
	CIRCLE = "1",
}

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
