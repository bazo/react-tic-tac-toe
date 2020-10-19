import { times } from "ramda";

import { getColumnIndex, getRowIndex } from "../functions";
import { BoardState, GameWinCheckStrategy, Player } from "../types";

function createRowStartIndexes(size: number): number[] {
	return times((i) => i * size, size);
}

function createColumnStartIndexes(size: number): number[] {
	return times((i) => i, size);
}

function isOnDiagonal(index: number, size: number): boolean {
	return index % (size + 1) === 0;
}

function isOnAntiDiagonal(index: number, size: number): boolean {
	if (index === 0 || index === size - 1) {
		return false;
	}

	return index % (size - 1) === 0;
}

const FullSizeStrategy = (size: number): GameWinCheckStrategy => {
	const rowsStartIndexes = createRowStartIndexes(size);
	const columnsStartIndexes = createColumnStartIndexes(size);

	function checkRow(boardState: BoardState, player: Player, index: number): boolean {
		const rowIndex = getRowIndex(boardState, index);
		const start = rowsStartIndexes[rowIndex];
		for (let i = start; i < start + size; i++) {
			if (boardState[i] !== player) {
				return false;
			}
		}

		return true;
	}

	function checkColumn(boardState: BoardState, player: Player, index: number): boolean {
		const columnIndex = getColumnIndex(boardState, index);

		const start = columnsStartIndexes[columnIndex];
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
		let index = size - 1;
		for (let i = 0; i < size; i++) {
			if (boardState[index] !== player) {
				return false;
			}
			index = index + size - 1;
		}

		return true;
	}

	function checkWin(boardState: BoardState, currentPlayer: Player, index: number): boolean {
		if (checkRow(boardState, currentPlayer, index)) {
			return true;
		}

		if (checkColumn(boardState, currentPlayer, index)) {
			return true;
		}

		if (isOnDiagonal(index, size) && checkDiagonal(boardState, currentPlayer)) {
			return true;
		}

		if (isOnAntiDiagonal(index, size) && checkAntiDiagonal(boardState, currentPlayer)) {
			return true;
		}

		return false;
	}

	function getWinningFields(): number[] {
		return [];
	}

	return {
		checkWin,
		getWinningFields,
	};
};

export default FullSizeStrategy;
