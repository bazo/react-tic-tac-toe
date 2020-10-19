import React, { FC } from "react";

import CenteredPanel from "./components/CenteredPanel";
import PlayerIndicator from "./components/PlayerSymbol";
import SettingsForm from "./components/SettingsForm";
import { playerSymbol } from "./functions";
import { Settings } from "./types";
import useGame from "./useGame";

const initialSettings = { size: 5, toWin: 3 } as Settings;

const Game: FC = () => {
	const { board: Board, player, winner, isDraw, settings, setSettings, reset } = useGame(initialSettings);

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
		<CenteredPanel>
			<h1>Tic Tac Toe</h1>

			<SettingsForm onSubmit={handleSettingsChange} initialSettings={settings} />
			<div onClick={handleResetClick}>Reset</div>

			{winner || isDraw ? (
				<>
					<h2>{winner ? `Winner is ${playerSymbol(player)}` : "It's a draw"}</h2>
				</>
			) : (
				<PlayerIndicator player={player} />
			)}

			<Board />
		</CenteredPanel>
	);
};

export default Game;
