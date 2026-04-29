import { UserProfileWrapper } from "@supertokens-plugins/profile-base-react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";

export const Route = createFileRoute("/user/profile")({
	beforeLoad: async () => {
		const exists = await doesSessionExist();
		if (!exists) {
			throw redirect({ to: "/auth" });
		}
	},
	component: UserProfileWrapper,
});
