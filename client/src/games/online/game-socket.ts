import { useEffect, useRef } from "react";

import { apiUrl } from "@/lib/api-url";

const url = `${apiUrl.replace(/^http/, "ws")}/ws`;

interface WebsocketHandler {
	onOpen?: (event: Event, ws: WebSocket) => void;
	onMessage?: (event: MessageEvent) => void;
	onError?: (event: Event) => void;
}

export function useGameSocket(gameId: string, handler: WebsocketHandler) {
	const socket = useRef<WebSocket | null>(null);

	useEffect(() => {
		const ws = new WebSocket(`${url}/${gameId}`);
		socket.current = ws;

		ws.onopen = () => {
			handler.onOpen?.(new Event("open"), ws);
		};

		ws.onmessage = (event) => {
			handler.onMessage?.(event);
		};

		ws.onerror = (error) => {
			handler.onError?.(error);
		};

		return () => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.close();
			} else if (ws.readyState === WebSocket.CONNECTING) {
				ws.addEventListener("open", () => ws.close());
			}
			socket.current = null;
		};
	}, [gameId, handler]);

	return {
		sendMessage: (message: string) => {
			socket.current?.send(message);
		},
	};
}
