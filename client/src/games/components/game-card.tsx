import { Link } from "@tanstack/react-router";
import { ExternalLinkIcon, LogInIcon, TrophyIcon, Grid3x3Icon, ClockIcon } from "lucide-react";
import type { GamePreview } from "shared/schemas";

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

interface BaseProps {
	game: GamePreview;
	currentUserId: string;
}

interface CreatedProps extends BaseProps {
	variant: "created";
}

interface OpenProps extends BaseProps {
	variant: "open";
	onJoin: (gameId: string) => void;
	isJoining?: boolean;
}

interface JoinedProps extends BaseProps {
	variant: "joined";
}

interface PastProps extends BaseProps {
	variant: "past";
}

type GameCardProps = CreatedProps | OpenProps | JoinedProps | PastProps;

export function GameCard(props: GameCardProps) {
	const { game, currentUserId, variant } = props;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{game.name}</CardTitle>
				<CardDescription>
					Created by{" "}
					<span className="font-medium text-foreground">
						{game.creator.id === currentUserId ? "you" : game.creator.nickname}
					</span>{" "}
					·{" "}
					<span className="inline-flex items-center gap-1">
						<ClockIcon className="size-3" />
						{formatRelative(game.createdAt)}
					</span>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-3 text-sm">
					<div className="flex items-center gap-2">
						<Grid3x3Icon className="size-4 text-muted-foreground" />
						<span className="text-muted-foreground">Size:</span>
						<span className="font-medium text-foreground">
							{game.size}x{game.size}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<TrophyIcon className="size-4 text-muted-foreground" />
						<span className="text-muted-foreground">To win:</span>
						<span className="font-medium text-foreground">{game.toWin}</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-muted-foreground">Symbol:</span>
						<span className="font-heading text-2xl leading-none text-foreground">
							{game.creatorSymbol}
						</span>
					</div>
					{game.creator.id === currentUserId ? (
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground">Opponent:</span>
							{game.opponent?.id ? (
								<span className="font-medium text-foreground">
									{game.opponent?.nickname}
								</span>
							) : (
								<span className="italic text-muted-foreground">Waiting...</span>
							)}
						</div>
					) : null}

					{game.currentPlayer && !game.winner ? (
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground">Current player:</span>
							<span className="font-medium text-foreground">
								{game.currentPlayer.nickname}
							</span>
						</div>
					) : null}

					{game.winner ? (
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground">Winner:</span>
							<span className="font-medium text-foreground">
								{game.winner.nickname}
							</span>
						</div>
					) : null}
				</div>
			</CardContent>
			<CardFooter>
				{variant !== "open" ? (
					<Link
						to="/online-game/$gameId"
						params={{ gameId: game.id }}
						target="_blank"
						rel="noopener noreferrer"
						className={buttonVariants({ className: "w-full" })}
					>
						<ExternalLinkIcon className="size-4" />
						Open game
					</Link>
				) : null}

				{variant === "open" ? (
					<Button
						className="w-full"
						onClick={() => props.onJoin(game.id)}
						disabled={props.isJoining}
					>
						<LogInIcon className="size-4" />
						{props.isJoining ? "Joining..." : "Join"}
					</Button>
				) : null}
			</CardFooter>
		</Card>
	);
}
