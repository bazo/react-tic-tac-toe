import { useEffect, useRef } from "react";
import GamePanel from "./components/game-panel";
import PlayerIndicator from "./components/player-symbol";
import SettingsForm, { initialSettings } from "./components/settings-form";
import useGame from "./use-game";
import { Button } from "@/components/ui/button";
import { playerSymbol } from "shared/game/functions";
import type { Settings } from "shared/game/types";
import { calculateBoardSizeToFit } from "./components/board";

export function Game() {
	const headerRef = useRef<HTMLDivElement>(null);
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
		const headerHeight =
			headerRef.current?.getBoundingClientRect().bottom ?? 0;
		setSettings({
			...settings,
			size: calculateBoardSizeToFit(headerHeight),
		});
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
			<div ref={headerRef}>
				<SettingsForm
					onSubmit={handleSettingsChange}
					initialSettings={settings}
				/>
				<div>
					<Button onClick={handleResetClick} variant="destructive">
						Reset
					</Button>
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
			</div>
			<Board />
		</GamePanel>
	);
}

export default Game;
