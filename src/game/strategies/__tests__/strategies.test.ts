import { Player } from "../../types";
import FullSizeStrategy from "../fullSizeStrategy";
import XToWinStrategy from "../xToWinStrategy";

describe("FullSizeStrategy", () => {
	const strategy = FullSizeStrategy(3);

	test("strategy.checkWin", () => {
		const boardWinColumnX = [Player.CROSS, Player.CIRCLE, undefined, Player.CROSS, Player.CIRCLE, undefined, Player.CROSS, undefined, undefined];
		expect(strategy.checkWin(boardWinColumnX, Player.CROSS, 6)).toBeTruthy();
		expect(strategy.checkWin(boardWinColumnX, Player.CIRCLE, 4)).toBeFalsy();

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
		expect(strategy.checkWin(boardWinColumnY, Player.CIRCLE, 7)).toBeTruthy();
		expect(strategy.checkWin(boardWinColumnY, Player.CROSS, 0)).toBeFalsy();

		const boardWinRowX = [Player.CROSS, Player.CROSS, Player.CROSS, Player.CIRCLE, Player.CIRCLE, undefined, undefined, undefined, undefined];
		expect(strategy.checkWin(boardWinRowX, Player.CROSS, 2)).toBeTruthy();

		const boardWinRowY = [Player.CROSS, undefined, undefined, Player.CROSS, Player.CROSS, undefined, Player.CIRCLE, Player.CIRCLE, Player.CIRCLE];
		expect(strategy.checkWin(boardWinRowY, Player.CIRCLE, 6)).toBeTruthy();

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
		expect(strategy.checkWin(boardWinDiagonalX, Player.CROSS, 8)).toBeTruthy();
	});
});

describe("xToWinStrategy", () => {
	const strategy = XToWinStrategy(3, 3);

	test("strategy.checkWin", () => {
		const boardWinColumnX = [Player.CROSS, Player.CIRCLE, undefined, Player.CROSS, Player.CIRCLE, undefined, Player.CROSS, undefined, undefined];
		expect(strategy.checkWin(boardWinColumnX, Player.CROSS, 6)).toBeTruthy();
		expect(strategy.checkWin(boardWinColumnX, Player.CIRCLE, 4)).toBeFalsy();

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
		expect(strategy.checkWin(boardWinColumnY, Player.CIRCLE, 7)).toBeTruthy();
		expect(strategy.checkWin(boardWinColumnY, Player.CROSS, 0)).toBeFalsy();

		const boardWinRowX = [Player.CROSS, Player.CROSS, Player.CROSS, Player.CIRCLE, Player.CIRCLE, undefined, undefined, undefined, undefined];
		expect(strategy.checkWin(boardWinRowX, Player.CROSS, 2)).toBeTruthy();

		const boardWinRowY = [Player.CROSS, undefined, undefined, Player.CROSS, Player.CROSS, undefined, Player.CIRCLE, Player.CIRCLE, Player.CIRCLE];
		expect(strategy.checkWin(boardWinRowY, Player.CIRCLE, 6)).toBeTruthy();

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
		expect(strategy.checkWin(boardWinDiagonalX, Player.CROSS, 8)).toBeTruthy();
	});
});
