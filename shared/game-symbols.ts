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
