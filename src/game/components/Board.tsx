import styled from "@emotion/styled";
import React, { FC } from "react";

import { getBoardSize, playerSymbol } from "../functions";
import { BoardState, Player, squareSize } from "../types";

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
	onClick: (index: number) => void;
}

const Board: FC<Props> = ({ state, winningFields, onClick }: Props) => {
	return (
		<BoardContainer size={getBoardSize(state)}>
			{state.map((player, index) => {
				return (
					<div onClick={onClick.bind(null, index)} key={index} className={winningFields.includes(index) ? "winning" : undefined}>
						<span className={player === Player.CIRCLE ? "circle" : "cross"}>{playerSymbol(player)}</span>
					</div>
				);
			})}
		</BoardContainer>
	);
};

export default Board;
