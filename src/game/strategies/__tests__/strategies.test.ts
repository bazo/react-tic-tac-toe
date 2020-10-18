import { checkWin } from "../../functions";
import { Player } from "../../types";
import FullSizeStrategy from "../fullSizeStrategy";

describe("FullSizeStrategy", () => {
	const strategy = FullSizeStrategy(3);

	test("checkWin", () => {
		const boardWinColumnX = [Player.CROSS, Player.CIRCLE, undefined, Player.CROSS, Player.CIRCLE, undefined, Player.CROSS, undefined, undefined];
		expect(checkWin(boardWinColumnX, Player.CROSS, 6, strategy)).toBeTruthy();
		expect(checkWin(boardWinColumnX, Player.CIRCLE, 4, strategy)).toBeFalsy();

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
		expect(checkWin(boardWinColumnY, Player.CIRCLE, 7, strategy)).toBeTruthy();
		expect(checkWin(boardWinColumnY, Player.CROSS, 0, strategy)).toBeFalsy();

		const boardWinRowX = [Player.CROSS, Player.CROSS, Player.CROSS, Player.CIRCLE, Player.CIRCLE, undefined, undefined, undefined, undefined];
		expect(checkWin(boardWinRowX, Player.CROSS, 2, strategy)).toBeTruthy();

		const boardWinRowY = [Player.CROSS, undefined, undefined, Player.CROSS, Player.CROSS, undefined, Player.CIRCLE, Player.CIRCLE, Player.CIRCLE];
		expect(checkWin(boardWinRowY, Player.CIRCLE, 6, strategy)).toBeTruthy();

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
		expect(checkWin(boardWinDiagonalX, Player.CROSS, 8, strategy)).toBeTruthy();
	});
});
