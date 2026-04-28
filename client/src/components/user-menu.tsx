import { useNavigate } from "@tanstack/react-router";
import Session from "supertokens-auth-react/recipe/session";
import { User, LogOut } from "lucide-react";
import { useProfile } from "@/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
	const navigate = useNavigate();
	const { data: profile } = useProfile();

	const displayName = profile?.nickname ?? profile?.email ?? "User";
	const initial = displayName[0].toUpperCase();

	const handleLogout = async () => {
		await Session.signOut();
		navigate({ to: "/auth" });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button variant="ghost" size="sm" className="gap-2">
						<Avatar size="sm">
							<AvatarFallback>{initial}</AvatarFallback>
						</Avatar>
						<span className="hidden sm:inline">{displayName}</span>
					</Button>
				}
			/>
			<DropdownMenuContent align="end" sideOffset={8}>
				<DropdownMenuGroup>
					<DropdownMenuLabel>
						<div className="flex flex-col">
							<span className="text-sm font-medium text-foreground">
								{profile?.nickname}
							</span>
							<span className="text-xs text-muted-foreground">{profile?.email}</span>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
					<User />
					Profile
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>
					<LogOut />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
