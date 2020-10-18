import React, { FC } from "react";

import CenteredPanel from "./components/CenteredPanel";
import PlayerIndicator from "./components/PlayerSymbol";
import SettingsForm from "./components/SettingsForm";
import { playerSymbol } from "./functions";
import { Settings } from "./types";
import useGame from "./useGame";

const initialSettings = { size: 3 } as Settings;

const Game: FC = () => {
	const { board: Board, player, winner, isDraw, settings, setSettings, reset } = useGame(initialSettings);

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
				<Board />
			)}
		</CenteredPanel>
	);
};

export default Game;
