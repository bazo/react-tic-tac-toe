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

function checkDiagonal(boardState: BoardState, player: Player): boolean {
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

function checkAntiDiagonal(boardState: BoardState, player: Player): boolean {
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

export function checkWin(boardState: BoardState, currentPlayer: Player, index: number): boolean {
	const size = getBoardSize(boardState);

	//check row
	const rowIndex = getRowIndex(boardState, index);
	const rowsStartIndexes = createRowStartIndexes(size);
	const rowStartIndex = rowsStartIndexes[rowIndex];
	if (checkRow(boardState, rowStartIndex, currentPlayer)) {
		return true;
	}

	//check column
	const columnIndex = getColumnIndex(boardState, index);
	const columnsStartIndexes = createColumnStartIndexes(size);
	const columnStartIndex = columnsStartIndexes[columnIndex];
	if (checkColumn(boardState, columnStartIndex, currentPlayer)) {
		return true;
	}

	if (isOnDiagonal(boardState, index) && checkDiagonal(boardState, currentPlayer)) {
		return true;
	}

	if (isOnAntiDiagonal(boardState, index) && checkAntiDiagonal(boardState, currentPlayer)) {
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

function getRowIndex(boardState: BoardState, index: number): number {
	const size = getBoardSize(boardState);
	return Math.floor(index / size);
}

function getColumnIndex(boardState: BoardState, index: number): number {
	const size = getBoardSize(boardState);
	return index % size;
}

function isOnDiagonal(boardState: BoardState, index: number): boolean {
	const size = getBoardSize(boardState);
	return index % (size + 1) === 0;
}

function isOnAntiDiagonal(boardState: BoardState, index: number): boolean {
	const size = getBoardSize(boardState);
	if (index === 0 || index === size - 1) {
		return false;
	}

	return index % (size - 1) === 0;
}
