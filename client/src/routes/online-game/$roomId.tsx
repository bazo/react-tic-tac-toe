import { createFileRoute, redirect } from "@tanstack/react-router";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { env } from "@/env";
import { useGameSocket } from "@/lib/ws";

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

	const { sendMessage } = useGameSocket(roomId, {
		onOpen: (event, ws) => {
			console.log("WebSocket connection opened", { event, ws });
			ws.send(`Hello from client in room ${roomId}`);
		},
		onMessage: (event) => {
			console.log("Message from server:", event.data);
		},
		onError: (error) => {
			console.error("WebSocket error:", error);
		},
	});

	// const socket = useRef<WebSocket | null>(null);

	// useEffect(() => {
	// 	const url = `${env.VITE_API_URL.replace(/^http/, "ws")}/ws`;
	// 	console.log("Connecting to WebSocket at", url);
	// 	const ws = new WebSocket(url);
	// 	socket.current = ws;

	// 	ws.onopen = () => {
	// 		console.log("WebSocket connection opened");
	// 		ws.send("hi from client");
	// 	};

	// 	ws.onmessage = (event) => {
	// 		console.log("Message from server:", event.data);
	// 	};

	// 	ws.onerror = (error) => {
	// 		console.error("WebSocket error:", error);
	// 	};

	// 	return () => {
	// 		if (ws.readyState === WebSocket.OPEN) {
	// 			ws.close();
	// 		} else if (ws.readyState === WebSocket.CONNECTING) {
	// 			ws.addEventListener("open", () => ws.close());
	// 		}
	// 		socket.current = null;
	// 	};
	// }, [roomId]);
	return (
		<div className="mx-auto max-w-lg py-8">
			<Card>
				<CardHeader>
					<CardTitle>Game room</CardTitle>
					<CardDescription>Room ID: {roomId}</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Game UI coming soon.
					</p>
					<button
						onClick={() => sendMessage("test message from client")}
					>
						Send test message to server
					</button>
				</CardContent>
			</Card>
		</div>
	);
}
