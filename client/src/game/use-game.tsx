import {
	type Dispatch,
	type FC,
	type ReactElement,
	type SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

import Board from "./components/board";
import { createBoard, getNextPlayer, isBoardFilled } from "shared/game/functions";
import XToWinStrategy from "shared/game/strategies/x-to-win-strategy";
import { type Settings } from "shared/game/types";
import { Player } from "shared/game-symbols";

interface GameHandlers {
	board: FC;
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
	const [player, setPlayer] = useState<Player>(Player.CROSS);
	const [winner, setWinner] = useState<Player>(null as unknown as Player);
	const [isDraw, setDraw] = useState(false);

	const strategy = useMemo(() => {
		return XToWinStrategy(settings.size, settings.toWin);
	}, [settings]);

	const reset = useCallback(() => {
		setPlayer(Player.CROSS);
		setBoardState(createBoard(settings.size));
		setWinner(null as unknown as Player);
		setDraw(false);
	}, [settings.size]);

	useEffect(() => {
		reset();
	}, [reset, settings]);

	const handleSquareClick = (index: number): void => {
		if (winner) {
			return;
		}
		if (boardState[index] === null) {
			boardState[index] = player;

			const newBoard = [...boardState];
			const isWin = strategy.checkWin(newBoard, player, index);
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

	const board: () => ReactElement = () => (
		<Board
			state={boardState}
			winningFields={winner ? strategy.getWinningFields() : []}
			onClick={handleSquareClick}
		/>
	);

	return { board, player, winner, isDraw, settings, setSettings, reset };
};

export default useGame;
