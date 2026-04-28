import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export function GamePanel({ children }: Props) {
	return <div className="mx-auto text-center">{children}</div>;
}

export default GamePanel;
