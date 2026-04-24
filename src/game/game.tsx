import { useEffect } from "react";
import GamePanel from "./components/game-panel";
import PlayerIndicator from "./components/player-symbol";
import SettingsForm from "./components/settings-form";
import { calculateBoardSizeToFit, playerSymbol } from "./functions";
import type { Settings } from "./types";
import useGame from "./use-game";

const initialSettings = { size: 5, toWin: 3 } as Settings;

export function Game() {
	const {
		board: Board,
		player,
		winner,
		isDraw,
		settings,
		setSettings,
		reset,
	} = useGame(initialSettings);

	useEffect(() => {
		setSettings({ ...settings, size: calculateBoardSizeToFit() });
		// oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
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

				<SettingsForm
					onSubmit={handleSettingsChange}
					initialSettings={settings}
				/>
				<div>
					<button onClick={handleResetClick} className="reset">
						Reset
					</button>
				</div>

				{winner || isDraw ? (
					<>
						<h2>
							{winner
								? `Winner is ${playerSymbol(player)}`
								: "It's a draw"}
						</h2>
					</>
				) : (
					<PlayerIndicator player={player} />
				)}
			</header>
			<Board />
		</GamePanel>
	);
}

export default Game;
