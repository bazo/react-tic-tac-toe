export const SymbolText = {
	CROSS: "×",
	CIRCLE: "○",
	EMPTY: "",
} as const;
export type SymbolText = (typeof SymbolText)[keyof typeof SymbolText];

export const Player = {
	CROSS: "0",
	CIRCLE: "1",
} as const;
export type Player = (typeof Player)[keyof typeof Player];

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
