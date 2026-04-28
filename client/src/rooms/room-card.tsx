import { ExternalLinkIcon, LogInIcon, TrophyIcon, Grid3x3Icon, ClockIcon } from "lucide-react";
import type { Room } from "shared/schemas";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatRelative } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

interface BaseProps {
	room: Room;
	currentUserId: string;
}

interface CreatedProps extends BaseProps {
	variant: "created";
}

interface OpenProps extends BaseProps {
	variant: "open";
	onJoin: (roomId: string) => void;
	isJoining?: boolean;
}

interface JoinedProps extends BaseProps {
	variant: "joined";
}

type RoomCardProps = CreatedProps | OpenProps | JoinedProps;

export function RoomCard({ room, currentUserId, variant }: RoomCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{room.name}</CardTitle>
				<CardDescription>
					Created by{" "}
					<span className="font-medium text-foreground">
						{room.creatorId === currentUserId ? "you" : room.creator.nickname}
					</span>{" "}
					·{" "}
					<span className="inline-flex items-center gap-1">
						<ClockIcon className="size-3" />
						{formatRelative(room.createdAt)}
					</span>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-3 text-sm">
					<div className="flex items-center gap-2">
						<Grid3x3Icon className="size-4 text-muted-foreground" />
						<span className="text-muted-foreground">Size:</span>
						<span className="font-medium text-foreground">
							{room.size}x{room.size}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<TrophyIcon className="size-4 text-muted-foreground" />
						<span className="text-muted-foreground">To win:</span>
						<span className="font-medium text-foreground">{room.toWin}</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-muted-foreground">Symbol:</span>
						<span className="font-heading text-2xl leading-none text-foreground">
							{room.creatorSymbol}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-muted-foreground">Opponent:</span>
						{room.opponentId ? (
							<span className="font-medium text-foreground">
								{room.opponent?.nickname}
							</span>
						) : (
							<span className="italic text-muted-foreground">Waiting...</span>
						)}
					</div>
				</div>
			</CardContent>
			<CardFooter>
				{variant === "created" || variant === "joined" ? (
					<Link
						to="/online-game/$roomId"
						params={{ roomId: room.id }}
						target="_blank"
						rel="noopener noreferrer"
						className={buttonVariants({ className: "w-full" })}
					>
						<ExternalLinkIcon className="size-4" />
						Open game
					</Link>
				) : null}

				{variant === "open" ? (
					<Button className="w-full">
						<LogInIcon className="size-4" />
						Join
					</Button>
				) : null}
			</CardFooter>
		</Card>
	);
}
