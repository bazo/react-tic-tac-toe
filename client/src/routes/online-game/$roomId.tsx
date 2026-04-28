import { createFileRoute, redirect } from "@tanstack/react-router";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/online-game/$roomId")({
	beforeLoad: async () => {
		const exists = await doesSessionExist();
		if (!exists) {
			throw redirect({ to: "/auth" });
		}
	},
	component: GameRoomPage,
});

function GameRoomPage() {
	const { roomId } = Route.useParams();

	return (
		<div className="mx-auto max-w-lg py-8">
			<Card>
				<CardHeader>
					<CardTitle>Game room</CardTitle>
					<CardDescription>Room ID: {roomId}</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">Game UI coming soon.</p>
				</CardContent>
			</Card>
		</div>
	);
}
