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
}

export type BoardState = (Player | undefined)[];

export interface GameWinCheckStrategy {
	checkColumn: (boardState: BoardState, player: Player, index: number) => boolean;
	checkRow: (boardState: BoardState, player: Player, index: number) => boolean;
	checkDiagonal: (boardState: BoardState, player: Player, index: number) => boolean;
	checkAntiDiagonal: (boardState: BoardState, player: Player, index: number) => boolean;
}
