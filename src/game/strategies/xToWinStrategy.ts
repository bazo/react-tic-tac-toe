import { times } from "ramda";

import { getColumnIndex, getRowIndex } from "../functions";
import { BoardState, GameWinCheckStrategy, Player } from "../types";

function createRowStartIndexes(size: number): number[] {
	return times((i) => i * size, size);
}

function createColumnStartIndexes(size: number): number[] {
	return times((i) => i, size);
}

function addToArray(array: number[], index: number): number[] {
	if (!array.includes(index)) {
		array.push(index);
	}
	return [...array];
}

const XToWinStrategy = (size: number, toWin: number): GameWinCheckStrategy => {
	const rowsStartIndexes = createRowStartIndexes(size);
	const columnsStartIndexes = createColumnStartIndexes(size);

	let consecutiveFields = [] as number[];

	function checkRow(boardState: BoardState, player: Player, index: number): boolean {
		const rowIndex = getRowIndex(boardState, index);
		const min = rowsStartIndexes[rowIndex];
		const max = min + size - 1;

		consecutiveFields = [index] as number[];

		//check to the left of click
		for (let i = 1; i < toWin + 1; i++) {
			const x = index - i;
			if (x < min) {
				break;
			}

			if (boardState[x] !== player) {
				break;
			} else {
				consecutiveFields = addToArray(consecutiveFields, x);
				if (consecutiveFields.length === toWin) {
					return true;
				}
			}
		}

		//check to the right of click
		const iMax = toWin - consecutiveFields.length + 1;
		for (let i = 1; i < iMax; i++) {
			const x = index + i;
			if (x > max) {
				break;
			}

			if (boardState[x] !== player) {
				break;
			} else {
				consecutiveFields = addToArray(consecutiveFields, x);
				if (consecutiveFields.length === toWin) {
					return true;
				}
			}
		}

		return false;
	}

	function checkColumn(boardState: BoardState, player: Player, index: number): boolean {
		const columnIndex = getColumnIndex(boardState, index);
		const rowIndex = getRowIndex(boardState, index);

		const min = columnsStartIndexes[columnIndex];
		const max = min + (size - 1) * size;

		consecutiveFields = [index] as number[];

		//check up from click
		const startX = rowIndex * size + columnIndex;
		for (let i = 1; i < toWin + 1; i++) {
			const x = startX - i * size;

			if (x < min) {
				break;
			}

			if (boardState[x] !== player) {
				break;
			} else {
				consecutiveFields = addToArray(consecutiveFields, x);
				if (consecutiveFields.length === toWin) {
					return true;
				}
			}
		}

		//check down from click
		const iMax = toWin - consecutiveFields.length + 1;
		for (let i = 1; i < iMax; i++) {
			const x = startX + i * size;

			if (x > max) {
				break;
			}

			if (boardState[x] !== player) {
				break;
			} else {
				consecutiveFields = addToArray(consecutiveFields, x);
				if (consecutiveFields.length === toWin) {
					return true;
				}
			}
		}

		return false;
	}

	function getXAtRowAndColumn(rowIndex: number, columnIndex: number): number {
		return rowIndex * size + columnIndex;
	}

	function checkDiagonal(boardState: BoardState, player: Player, index: number): boolean {
		const startRowIndex = getRowIndex(boardState, index);
		const startColumnIndex = getColumnIndex(boardState, index);

		consecutiveFields = [index] as number[];

		//check up left from click
		for (let i = 1; i <= toWin + 1; i++) {
			const rowIndex = startRowIndex - i;
			const columnIndex = startColumnIndex - i;
			if (rowIndex < 0 || columnIndex < 0) {
				break;
			}
			const x = getXAtRowAndColumn(rowIndex, columnIndex);

			if (boardState[x] !== player) {
				break;
			} else {
				consecutiveFields = addToArray(consecutiveFields, x);
				if (consecutiveFields.length === toWin) {
					return true;
				}
			}
		}

		//check right down from click
		const iMax = toWin - consecutiveFields.length + 1;
		for (let i = 1; i < iMax; i++) {
			const rowIndex = startRowIndex + i;
			const columnIndex = startColumnIndex + i;

			if (rowIndex > size - 1 || columnIndex > size - 1) {
				break;
			}
			const x = getXAtRowAndColumn(rowIndex, columnIndex);

			if (boardState[x] !== player) {
				break;
			} else {
				consecutiveFields = addToArray(consecutiveFields, x);
				if (consecutiveFields.length === toWin) {
					return true;
				}
			}
		}

		return false;
	}

	function checkAntiDiagonal(boardState: BoardState, player: Player, index: number): boolean {
		const startRowIndex = getRowIndex(boardState, index);
		const startColumnIndex = getColumnIndex(boardState, index);

		consecutiveFields = [index] as number[];

		//check up right from click
		for (let i = 1; i <= toWin + 1; i++) {
			const rowIndex = startRowIndex - i;
			const columnIndex = startColumnIndex + i;

			if (rowIndex < 0 || columnIndex > size - 1) {
				break;
			}
			const x = getXAtRowAndColumn(rowIndex, columnIndex);

			if (boardState[x] !== player) {
				break;
			} else {
				consecutiveFields = addToArray(consecutiveFields, x);
				if (consecutiveFields.length === toWin) {
					return true;
				}
			}
		}

		//check left down from click
		const iMax = toWin - consecutiveFields.length + 1;
		for (let i = 1; i < iMax; i++) {
			const rowIndex = startRowIndex + i;
			const columnIndex = startColumnIndex - i;

			if (rowIndex > size - 1 || columnIndex < 0) {
				break;
			}
			const x = getXAtRowAndColumn(rowIndex, columnIndex);

			if (boardState[x] !== player) {
				break;
			} else {
				consecutiveFields = addToArray(consecutiveFields, x);
				if (consecutiveFields.length === toWin) {
					return true;
				}
			}
		}

		return false;
	}

	function checkWin(boardState: BoardState, currentPlayer: Player, index: number): boolean {
		if (checkRow(boardState, currentPlayer, index)) {
			return true;
		}

		if (checkColumn(boardState, currentPlayer, index)) {
			return true;
		}

		if (checkDiagonal(boardState, currentPlayer, index)) {
			return true;
		}

		if (checkAntiDiagonal(boardState, currentPlayer, index)) {
			return true;
		}

		return false;
	}

	function getWinningFields(): number[] {
		return consecutiveFields;
	}

	return {
		checkWin,
		getWinningFields,
	};
};

export default XToWinStrategy;
