import React, { FC, useCallback, useEffect, useState } from "react";

import Board from "./components/Board";
import CenteredPanel from "./components/CenteredPanel";
import PlayerIndicator from "./components/PlayerSymbol";
import SettingsForm from "./components/SettingsForm";
import { checkWin, createBoard, getNextPlayer, isBoardFilled, playerSymbol } from "./functions";
import { Player, Settings } from "./types";

const initialSettings = { size: 3 } as Settings;

const Game: FC = () => {
	const [settings, setSettings] = useState(initialSettings);
	const [board, setBoard] = useState(createBoard(settings.size));
	const [player, setPlayer] = useState(Player.CROSS);
	const [winner, setWinner] = useState((null as unknown) as Player);
	const [isDraw, setDraw] = useState(false);

	const reset = useCallback(() => {
		setPlayer(Player.CROSS);
		setBoard(createBoard(settings.size));
		setWinner((null as unknown) as Player);
		setDraw(false);
	}, [settings.size]);

	useEffect(() => {
		reset();
	}, [reset, settings.size]);

	const handleSquareClick = (index: number): void => {
		if (board[index] === undefined) {
			board[index] = player;

			const newBoard = [...board];
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
			setBoard(newBoard);
			setPlayer(getNextPlayer(player));
		}
	};

	const handleSettingsChange = (settings: Settings): void => {
		setSettings(settings);
	};

	return (
		<CenteredPanel>
			<h1>Tic Tac Toe</h1>

			<PlayerIndicator player={player} />

			<SettingsForm onSubmit={handleSettingsChange} initialSettings={settings} />

			{winner || isDraw ? (
				<>
					<h2>{winner ? `Winner is ${playerSymbol(player)}` : "It's a draw"}</h2>
					<div onClick={reset}>Reset</div>
				</>
			) : (
				<Board state={board} onClick={handleSquareClick} />
			)}
		</CenteredPanel>
	);
};

export default Game;
