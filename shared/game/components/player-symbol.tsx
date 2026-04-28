import styled from "@emotion/styled";

import { playerSymbol } from "../functions";
import type { Player } from "shared/game-symbols";

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

export function PlayerIndicator({ player }: Props) {
	return (
		<StyledSpan>
			Player: <span className="symbol">{playerSymbol(player)}</span>
		</StyledSpan>
	);
}

export default PlayerIndicator;
