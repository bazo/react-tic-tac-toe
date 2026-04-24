import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const linkClass =
	"rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";
const activeLinkClass =
	"rounded-md px-3 py-1.5 text-sm font-medium bg-muted text-foreground";

interface Props {
	children: ReactNode;
}

export function Layout({ children }: Props) {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="border-b border-border">
				<nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
					<Link to="/game" className="flex items-center gap-2">
						<img src="/icon.svg" alt="Tic Tac Toe" className="size-8" />
						<span className="font-heading text-lg font-semibold">
							Tic Tac Toe
						</span>
					</Link>

					<div className="flex items-center gap-1">
						<Link
							to="/game"
							className={linkClass}
							activeProps={{ className: activeLinkClass }}
						>
							Game
						</Link>
						<Link
							to="/login"
							className={linkClass}
							activeProps={{ className: activeLinkClass }}
						>
							Login
						</Link>
					</div>

					<div className="ml-auto">
						<ThemeToggle />
					</div>
				</nav>
			</header>

			<main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
		</div>
	);
}
