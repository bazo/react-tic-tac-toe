import { repeat, times } from "ramda";

import { BoardState, Player } from "./types";

export function createBoard(size: number): BoardState {
	return repeat(undefined, size * size);
}

export function getNextPlayer(currentPlayer: Player): Player {
	return currentPlayer === Player.CROSS ? Player.CIRCLE : Player.CROSS;
}

function createRowStartIndexes(size: number): number[] {
	return times((i) => i * size, size);
}

function checkRow(board: BoardState, start: number, size: number, player: Player): boolean {
	for (let i = start; i < start + size; i++) {
		if (board[i] !== player) {
			return false;
		}
	}

	return true;
}

function createColumnStartIndexes(size: number): number[] {
	return times((i) => i, size);
}

function checkColumn(board: BoardState, start: number, size: number, player: Player): boolean {
	const max = start + size;
	let counter = 0;
	for (let i = start; i < max; i++) {
		const index = start + size * counter;
		if (board[index] !== player) {
			return false;
		}
		counter++;
	}

	return true;
}

function checkLeftDiagonal(board: BoardState, player: Player, size: number): boolean {
	let index = 0;
	for (let i = 0; i < size; i++) {
		if (board[index] !== player) {
			return false;
		}
		console.log(typeof index, typeof size);
		index = index + size + 1;
	}

	return true;
}

function checkRightDiagonal(board: BoardState, player: Player, size: number): boolean {
	let index = size - 1;
	for (let i = 0; i < size; i++) {
		if (board[index] !== player) {
			return false;
		}
		index = index + size - 1;
	}

	return true;
}

export function checkWin(board: BoardState, currentPlayer: Player, index: number, size: number): boolean {
	//check rows
	const rowsStartIndexes = createRowStartIndexes(size);
	for (const startIndex of rowsStartIndexes) {
		const res = checkRow(board, startIndex, size, currentPlayer);
		if (res) {
			return true;
		}
	}

	//check columns
	const columnsStartIndexes = createColumnStartIndexes(size);
	for (const startIndex of columnsStartIndexes) {
		const res = checkColumn(board, startIndex, size, currentPlayer);
		if (res) {
			return true;
		}
	}

	if (checkLeftDiagonal(board, currentPlayer, size)) {
		return true;
	}

	if (checkRightDiagonal(board, currentPlayer, size)) {
		return true;
	}

	return false;
}

export function isBoardFilled(board: BoardState, size: number): boolean {
	return board.filter((symbol) => symbol !== undefined).length === Math.pow(size, 2);
}

const CROSS = "×";
const CIRCLE = "○";

export function playerSymbol(player: Player | undefined): string {
	if (!player) {
		return "";
	}
	return player === Player.CROSS ? CROSS : CIRCLE;
}
