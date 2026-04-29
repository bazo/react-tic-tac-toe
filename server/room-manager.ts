import { WebSocket } from "ws";

const hour = 60 * 60 * 1000;

export class RoomManager {
	private rooms: Map<string, Set<{ ws: WebSocket; timestamp: number }>> = new Map();
	private ttl = hour;

	public __construct(ttl = hour) {
		this.ttl = ttl;

		// Periodically clean up old clients
		setInterval(() => {
			const now = Date.now();
			for (const [roomId, clients] of this.rooms.entries()) {
				for (const client of clients) {
					if (now - client.timestamp > this.ttl) {
						clients.delete(client);
					}
				}
				if (clients.size === 0) {
					this.rooms.delete(roomId);
				}
			}
		}, this.ttl);
	}

	addClientToRoom(roomId: string, ws: WebSocket) {
		if (!this.rooms.has(roomId)) {
			this.rooms.set(roomId, new Set());
		}
		this.rooms.get(roomId)!.add({
			ws,
			timestamp: Date.now(),
		});
	}

	private findClientInRoom(roomId: string, ws: WebSocket) {
		const room = this.rooms.get(roomId);
		if (room) {
			for (const client of room) {
				if (client.ws === ws) {
					return client;
				}
			}
		}
		return null;
	}

	removeClientFromRoom(roomId: string, ws: WebSocket) {
		const room = this.rooms.get(roomId);
		if (room) {
			const client = this.findClientInRoom(roomId, ws);
			if (client) {
				room.delete(client);
			}
			if (room.size === 0) {
				this.rooms.delete(roomId);
			}
		}
	}

	broadcastToRoom(roomId: string, message: string) {
		const room = this.rooms.get(roomId);
		if (room) {
			for (const client of room) {
				if (client.ws.readyState === WebSocket.OPEN) {
					client.ws.send(message);
				}
			}
		}
	}
}
