export enum Player {
	CROSS = "0",
	CIRCLE = "1",
}

export interface Settings {
	size: number;
}

export type BoardState = (Player | undefined)[];
