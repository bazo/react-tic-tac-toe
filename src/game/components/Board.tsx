import styled from "@emotion/styled";

interface Props {
	size: number;
}

const squareSize = 48;
const borderWidth = 1;
const border = `${borderWidth}px solid #ccc`;

const Board = styled.div<Props>`
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
export default Board;
