import { times } from "ramda";

import { getColumnIndex, getRowIndex } from "../functions";
import { BoardState, GameWinCheckStrategy, Player } from "../types";

function createRowStartIndexes(size: number): number[] {
	return times((i) => i * size, size);
}

function createColumnStartIndexes(size: number): number[] {
	return times((i) => i, size);
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

	return {
		checkRow,
		checkColumn,
		checkDiagonal,
		checkAntiDiagonal,
	};
};

export default FullSizeStrategy;
