import styled from "@emotion/styled";

import { getBoardSize, playerSymbol } from "shared/game/functions";
import { type BoardState } from "shared/game/types";
import { Player } from "shared/game-symbols";

export const squareSize = 48;

export function calculateBoardSizeToFit(usedHeight: number): number {
	const pixels = Math.min(
		window.innerHeight - usedHeight - 20,
		window.innerWidth - 20,
	);

	return Math.floor(pixels / squareSize);
}

interface ContainerProps {
	size: number;
}

const borderWidth = 1;
const border = `${borderWidth}px solid #333`;

const BoardContainer = styled.div<ContainerProps>`
	margin: 0 auto;
	margin-top: 20px;
	display: flex;
	flex-wrap: wrap;
	width: ${({ size }): string => `${size * squareSize + borderWidth}px;`};
	height: ${({ size }): string => `${size * squareSize}px;`};
	border-bottom: ${border};
	border-left: ${border};

	div {
		box-sizing: border-box;
		width: ${squareSize}px;
		height: ${squareSize}px;
		line-height: ${squareSize}px;
		display: flex;
		vertical-align: middle;
		align-items: center;
		flex-direction: column;
		text-align: center;
		border-top: ${border};
		border-right: ${border};

		&.winning {
			background-color: red;
		}

		span {
			font-size: ${squareSize}px;
			vertical-align: middle;

			&.circle {
				margin-top: -2px;
			}
		}
	}
`;

interface Props {
	state: BoardState;
	winningFields: number[];
	onClick?: (index: number) => void;
}

export function Board({ state, winningFields, onClick }: Props) {
	return (
		<BoardContainer size={getBoardSize(state)}>
			{state.map((player, index) => {
				return (
					<div
						onClick={
							onClick ? onClick.bind(null, index) : undefined
						}
						key={index}
						className={
							winningFields.includes(index)
								? "winning"
								: undefined
						}
					>
						<span
							className={
								player === Player.CIRCLE ? "circle" : "cross"
							}
						>
							{playerSymbol(player)}
						</span>
					</div>
				);
			})}
		</BoardContainer>
	);
}

export default Board;
