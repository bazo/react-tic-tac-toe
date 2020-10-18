import styled from "@emotion/styled";
import React, { FC } from "react";

import { playerSymbol } from "../functions";
import { Player } from "../types";

const StyledSpan = styled.span`
	line-height: 36px;
	.symbol {
		font-size: 36px;
		vertical-align: bottom;
	}
`;

interface Props {
	player: Player;
}

const PlayerIndicator: FC<Props> = ({ player }: Props) => {
	return (
		<StyledSpan>
			Player: <span className="symbol">{playerSymbol(player)}</span>
		</StyledSpan>
	);
};

export default PlayerIndicator;
