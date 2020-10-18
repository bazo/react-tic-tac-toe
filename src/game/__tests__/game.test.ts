import { createBoard, getBoardSize, getNextPlayer, isBoardFilled, playerSymbol } from "../functions";
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
});
