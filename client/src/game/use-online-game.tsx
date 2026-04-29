import { useState, type ReactElement } from "react";

import Board from "./components/board";
import {
	GameMoveResultSchema,
	type Game,
	type GamePlayer,
} from "shared/schemas";
import { useGameSocket } from "@/lib/ws";

interface useOnlineGameProps {
	game: Game;
	playerId: string;
}

export const useOnlineGame = ({ game, playerId }: useOnlineGameProps) => {
	const [boardState, setBoardState] = useState(game.state);
	const [canPlay, setCanPlay] = useState<boolean>(
		game.currentPlayer.id === playerId,
	);
	const [winningFields, setWinningFields] = useState<number[]>(
		game.winningFields,
	);

	const [winner, setWinner] = useState<GamePlayer | null>(game.winner);
	const [isDraw, setDraw] = useState(game.draw);

	const { sendMessage } = useGameSocket(game.id, {
		onOpen: (event, ws) => {
			console.log("WebSocket connection opened", { event, ws });
		},
		onMessage: (event) => {
			const parsed = JSON.parse(event.data);
			const data = GameMoveResultSchema.safeParse(parsed);
			if (data.success) {
				if (data.data.type === "update") {
					const {
						nextBoardState,
						nextPlayerId,
						winnerId,
						winningFields,
						draw,
					} = data.data;
					setBoardState(nextBoardState);
					setCanPlay(nextPlayerId === playerId);
					if (winnerId) {
						const winner =
							winnerId === game.creator.id
								? game.creator
								: game.opponent;
						setWinner(winner);
						setWinningFields(winningFields);
					}

					if (draw) {
						setDraw(true);
					}
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
		if (!game.winner && !game.draw) {
			sendMessage(JSON.stringify({ type: "makeMove", index }));
		}
	};

	const board: () => ReactElement = () => (
		<Board
			state={boardState}
			winningFields={winningFields}
			onClick={canPlay ? handleSquareClick : undefined}
		/>
	);

	const opponentNickname =
		game.creator.id === playerId
			? game.opponent.nickname
			: game.creator.nickname;

	return { board, canPlay, opponentNickname, winner, isDraw };
};
