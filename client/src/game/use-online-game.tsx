import { useState, type FC, type ReactElement } from "react";

import Board from "./components/board";
import { Player } from "shared/game-symbols";
import { GameMoveResultSchema, type Game } from "shared/schemas";
import { useGameSocket } from "@/lib/ws";

interface GameHandlers {
	board: FC;
	player: Player;
	winner: Player;
	isDraw: boolean;
}

interface useOnlineGameProps {
	game: Game;
	playerId: string;
}

export const useOnlineGame = ({ game, playerId }: useOnlineGameProps) => {
	const [boardState, setBoardState] = useState(game.state);
	const [canPlay, setCanPlay] = useState<boolean>(
		game.currentPlayer.id === playerId,
	);

	const [winner, setWinner] = useState<Player>(null as unknown as Player);
	const [isDraw, setDraw] = useState(false);

	const { sendMessage } = useGameSocket(game.id, {
		onOpen: (event, ws) => {
			console.log("WebSocket connection opened", { event, ws });
		},
		onMessage: (event) => {
			const parsed = JSON.parse(event.data);
			const data = GameMoveResultSchema.safeParse(parsed);
			if (data.success) {
				if (data.data.type === "update") {
					const { nextBoardState, nextPlayerId } = data.data;
					setBoardState(nextBoardState);
					setCanPlay(nextPlayerId === playerId);
				}
			} else {
				console.error("Invalid message from server:", data.error);
			}
		},
		onError: (error) => {
			console.error("WebSocket error:", error);
		},
	});

	const handleSquareClick = (index: number): void => {
		sendMessage(JSON.stringify({ type: "makeMove", index }));
	};

	const board: () => ReactElement = () => (
		<Board
			state={boardState}
			winningFields={[]}
			onClick={canPlay ? handleSquareClick : undefined}
		/>
	);

	const opponentNickname =
		game.creator.id === playerId
			? game.opponent.nickname
			: game.creator.nickname;

	return { board, canPlay, opponentNickname, winner, isDraw };
};
