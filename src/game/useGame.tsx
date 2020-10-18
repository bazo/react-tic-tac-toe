import React, { Dispatch, FC, ReactElement, SetStateAction, useCallback, useEffect, useState } from "react";

import Board from "./components/Board";
import { checkWin, createBoard, getNextPlayer, isBoardFilled } from "./functions";
import { Player, Settings } from "./types";

interface GameHandlers {
	board: FC<{}>;
	player: Player;
	winner: Player;
	isDraw: boolean;
	settings: Settings;
	setSettings: Dispatch<SetStateAction<Settings>>;
	reset: () => void;
}

const useGame = (initialSettings: Settings): GameHandlers => {
	const [settings, setSettings] = useState(initialSettings);
	const [boardState, setBoardState] = useState(createBoard(settings.size));
	const [player, setPlayer] = useState(Player.CROSS);
	const [winner, setWinner] = useState((null as unknown) as Player);
	const [isDraw, setDraw] = useState(false);

	const reset = useCallback(() => {
		setPlayer(Player.CROSS);
		setBoardState(createBoard(settings.size));
		setWinner((null as unknown) as Player);
		setDraw(false);
	}, [settings.size]);

	useEffect(() => {
		reset();
	}, [reset, settings.size]);

	const handleSquareClick = (index: number): void => {
		if (boardState[index] === undefined) {
			boardState[index] = player;

			const newBoard = [...boardState];
			const isWin = checkWin(newBoard, player);
			if (isWin) {
				setWinner(player);
				return;
			} else {
				if (isBoardFilled(newBoard)) {
					setDraw(true);
					return;
				}
			}
			setBoardState(newBoard);
			setPlayer(getNextPlayer(player));
		}
	};

	const board: FC = (): ReactElement => <Board state={boardState} onClick={handleSquareClick} />;

	return { board, player, winner, isDraw, settings, setSettings, reset };
};

export default useGame;
