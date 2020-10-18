import { checkWin, createBoard, getBoardSize, getNextPlayer, isBoardFilled, playerSymbol } from "../functions";
import { Player, SymbolText } from "../types";

describe("game", () => {
	test("createBoard", () => {
		const boardState = createBoard(5);
		expect(boardState).toHaveLength(25);
	});

	test("getBoardSize", () => {
		const boardState = createBoard(5);
		expect(getBoardSize(boardState)).toBe(5);
	});

	test("getNextPlayer", () => {
		expect(getNextPlayer(Player.CROSS)).toBe(Player.CIRCLE);
		expect(getNextPlayer(Player.CIRCLE)).toBe(Player.CROSS);
	});

	test("playerSymbol", () => {
		expect(playerSymbol(Player.CROSS)).toBe(SymbolText.CROSS);
		expect(playerSymbol(Player.CIRCLE)).toBe(SymbolText.CIRCLE);
		expect(playerSymbol(undefined)).toBe(SymbolText.EMPTY);
	});

	test("isBoardFilled", () => {
		expect(isBoardFilled(createBoard(3))).toBeFalsy();
		expect(
			isBoardFilled([
				Player.CROSS,
				Player.CIRCLE,
				Player.CIRCLE,
				Player.CROSS,
				Player.CIRCLE,
				Player.CROSS,
				Player.CIRCLE,
				Player.CROSS,
				Player.CIRCLE,
			])
		).toBeTruthy();
	});

	test("checkWin", () => {
		const boardWinColumnX = [Player.CROSS, Player.CIRCLE, undefined, Player.CROSS, Player.CIRCLE, undefined, Player.CROSS, undefined, undefined];
		expect(checkWin(boardWinColumnX, Player.CROSS, 6)).toBeTruthy();
		expect(checkWin(boardWinColumnX, Player.CIRCLE, 4)).toBeFalsy();

		const boardWinColumnY = [
			Player.CROSS,
			Player.CIRCLE,
			undefined,
			Player.CROSS,
			Player.CIRCLE,
			undefined,
			undefined,
			Player.CIRCLE,
			Player.CROSS,
		];
		expect(checkWin(boardWinColumnY, Player.CIRCLE, 7)).toBeTruthy();
		expect(checkWin(boardWinColumnY, Player.CROSS, 0)).toBeFalsy();

		const boardWinRowX = [Player.CROSS, Player.CROSS, Player.CROSS, Player.CIRCLE, Player.CIRCLE, undefined, undefined, undefined, undefined];
		expect(checkWin(boardWinRowX, Player.CROSS, 3)).toBeTruthy();

		const boardWinRowY = [Player.CROSS, undefined, undefined, Player.CROSS, Player.CROSS, undefined, Player.CIRCLE, Player.CIRCLE, Player.CIRCLE];
		expect(checkWin(boardWinRowY, Player.CIRCLE, 6)).toBeTruthy();

		const boardWinDiagonalX = [
			Player.CROSS,
			Player.CIRCLE,
			undefined,
			Player.CIRCLE,
			Player.CROSS,
			undefined,
			undefined,
			undefined,
			Player.CROSS,
		];
		expect(checkWin(boardWinDiagonalX, Player.CROSS, 8)).toBeTruthy();
	});
});
