import styled from "@emotion/styled";
import React, { FC } from "react";

import { getBoardSize, playerSymbol } from "../functions";
import { BoardState } from "../types";

interface ContainerProps {
	size: number;
}

const squareSize = 48;
const borderWidth = 1;
const border = `${borderWidth}px solid #ccc`;

const BoardContainer = styled.div<ContainerProps>`
	margin: 0 auto;
	margin-top: 20px;
	color: black;
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

		span {
			font-size: ${squareSize}px;
			vertical-align: middle;
		}
	}
`;

interface Props {
	state: BoardState;
	onClick: (index: number) => void;
}

const Board: FC<Props> = ({ state, onClick }: Props) => {
	return (
		<BoardContainer size={getBoardSize(state)}>
			{state.map((player, index) => {
				return (
					<div onClick={onClick.bind(null, index)} key={index}>
						<span>{playerSymbol(player)}</span>
					</div>
				);
			})}
		</BoardContainer>
	);
};

export default Board;
