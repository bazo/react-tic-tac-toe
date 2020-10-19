import React, { FC, useEffect } from "react";

import GamePanel from "./components/GamePanel";
import PlayerIndicator from "./components/PlayerSymbol";
import SettingsForm from "./components/SettingsForm";
import { calculateBoardSizeToFit, playerSymbol } from "./functions";
import { Settings } from "./types";
import useGame from "./useGame";

const initialSettings = { size: 5, toWin: 3 } as Settings;

const Game: FC = () => {
	const { board: Board, player, winner, isDraw, settings, setSettings, reset } = useGame(initialSettings);

	useEffect(() => {
		setSettings({ ...settings, size: calculateBoardSizeToFit() });
	}, []);

	const handleSettingsChange = (settings: Settings): void => {
		setSettings(settings);
	};

	const handleResetClick = (): void => {
		let doIt = true;
		if (!winner) {
			doIt = window.confirm("Really reset?");
		}
		if (doIt) {
			reset();
		}
	};

	return (
		<GamePanel>
			<header>
				<h1>Tic Tac Toe</h1>

				<SettingsForm onSubmit={handleSettingsChange} initialSettings={settings} />
				<div>
					<button onClick={handleResetClick} className="reset">
						Reset
					</button>
				</div>

				{winner || isDraw ? (
					<>
						<h2>{winner ? `Winner is ${playerSymbol(player)}` : "It's a draw"}</h2>
					</>
				) : (
					<PlayerIndicator player={player} />
				)}
			</header>
			<Board />
		</GamePanel>
	);
};

export default Game;
