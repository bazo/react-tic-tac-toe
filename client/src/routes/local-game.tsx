import { createFileRoute } from "@tanstack/react-router";
import Game from "../game/game";

export const Route = createFileRoute("/local-game")({
	component: Game,
});
