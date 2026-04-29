import { useEffect, useRef } from "react";
import { playerSymbol } from "shared/game/functions";
import type { Settings } from "shared/game/types";

import { Button } from "@/components/ui/button";
import { calculateBoardSizeToFit } from "@/games/components/board";
import GamePanel from "@/games/components/game-panel";
import PlayerIndicator from "@/games/components/player-symbol";
import SettingsForm, { initialSettings } from "@/games/components/settings-form";
import useGame from "@/games/local/use-game";

export function LocalGame() {
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
		const headerHeight = headerRef.current?.getBoundingClientRect().bottom ?? 0;
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
				<SettingsForm onSubmit={handleSettingsChange} initialSettings={settings} />
				<div>
					<Button onClick={handleResetClick} variant="destructive">
						Reset
					</Button>
				</div>

				{winner || isDraw ? (
					<>
						<h2>{winner ? `Winner is ${playerSymbol(player)}` : "It's a draw"}</h2>
					</>
				) : (
					<PlayerIndicator player={player} />
				)}
			</div>
			<Board />
		</GamePanel>
	);
}
