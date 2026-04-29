import { createFileRoute } from "@tanstack/react-router";

import { LocalGame } from "../games/local/local-game";

export const Route = createFileRoute("/local-game")({
	component: LocalGame,
});
