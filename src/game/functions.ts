import { repeat, times } from "ramda";

import { BoardState, Player, SymbolText } from "./types";

export function createBoard(size: number): BoardState {
	return repeat(undefined, Math.pow(size, 2));
}

export function getNextPlayer(currentPlayer: Player): Player {
	return currentPlayer === Player.CROSS ? Player.CIRCLE : Player.CROSS;
}

function createRowStartIndexes(size: number): number[] {
	return times((i) => i * size, size);
}

function checkRow(boardState: BoardState, start: number, player: Player): boolean {
	const size = getBoardSize(boardState);

	for (let i = start; i < start + size; i++) {
		if (boardState[i] !== player) {
			return false;
		}
	}

	return true;
}

function createColumnStartIndexes(size: number): number[] {
	return times((i) => i, size);
}

function checkColumn(boardState: BoardState, start: number, player: Player): boolean {
	const size = getBoardSize(boardState);

	const max = start + size;
	let counter = 0;
	for (let i = start; i < max; i++) {
		const index = start + size * counter;
		if (boardState[index] !== player) {
			return false;
		}
		counter++;
	}

	return true;
}

function checkLeftDiagonal(boardState: BoardState, player: Player): boolean {
	const size = getBoardSize(boardState);

	let index = 0;
	for (let i = 0; i < size; i++) {
		if (boardState[index] !== player) {
			return false;
		}
		index = index + size + 1;
	}

	return true;
}

function checkRightDiagonal(boardState: BoardState, player: Player): boolean {
	const size = getBoardSize(boardState);

	let index = size - 1;
	for (let i = 0; i < size; i++) {
		if (boardState[index] !== player) {
			return false;
		}
		index = index + size - 1;
	}

	return true;
}

export function checkWin(boardState: BoardState, currentPlayer: Player): boolean {
	const size = getBoardSize(boardState);

	//check rows
	const rowsStartIndexes = createRowStartIndexes(size);
	for (const startIndex of rowsStartIndexes) {
		const res = checkRow(boardState, startIndex, currentPlayer);
		if (res) {
			return true;
		}
	}

	//check columns
	const columnsStartIndexes = createColumnStartIndexes(size);
	for (const startIndex of columnsStartIndexes) {
		const res = checkColumn(boardState, startIndex, currentPlayer);
		if (res) {
			return true;
		}
	}

	if (checkLeftDiagonal(boardState, currentPlayer)) {
		return true;
	}

	if (checkRightDiagonal(boardState, currentPlayer)) {
		return true;
	}

	return false;
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
