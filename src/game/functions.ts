import { repeat } from "ramda";

import { BoardState, Player, squareSize, SymbolText } from "./types";

export function createBoard(size: number): BoardState {
	return repeat(undefined, Math.pow(size, 2));
}

export function getNextPlayer(currentPlayer: Player): Player {
	return currentPlayer === Player.CROSS ? Player.CIRCLE : Player.CROSS;
}

export function isBoardFilled(boardState: BoardState): boolean {
	const length = boardState.length;
	return boardState.filter((symbol) => symbol !== undefined).length === length;
}

export function playerSymbol(player: Player | undefined): SymbolText {
	if (!player) {
		return SymbolText.EMPTY;
	}
	return player === Player.CROSS ? SymbolText.CROSS : SymbolText.CIRCLE;
}

export function getBoardSize(boardState: BoardState): number {
	return Math.sqrt(boardState.length);
}

export function getRowIndex(boardState: BoardState, index: number): number {
	const size = getBoardSize(boardState);
	return Math.floor(index / size);
}

export function getColumnIndex(boardState: BoardState, index: number): number {
	const size = getBoardSize(boardState);
	return index % size;
}

export function isOnDiagonal(boardState: BoardState, index: number): boolean {
	const size = getBoardSize(boardState);
	return index % (size + 1) === 0;
}

export function isOnAntiDiagonal(boardState: BoardState, index: number): boolean {
	const size = getBoardSize(boardState);
	if (index === 0 || index === size - 1) {
		return false;
	}

	return index % (size - 1) === 0;
}

export function calculateBoardSizeToFit(): number {
	const headerEl = document.getElementsByTagName("header")[0];
	console.log(window.innerHeight, window.innerWidth);

	const pixels = Math.min(window.innerHeight - headerEl.getBoundingClientRect().height - 20, window.innerWidth - 20);
	console.log({ pixels });

	return Math.floor(pixels / squareSize);
}
