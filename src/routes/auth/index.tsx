import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "supertokens-auth-react/ui";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";

const preBuiltUIList = [EmailPasswordPreBuiltUI, ThirdPartyPreBuiltUI];

export const Route = createFileRoute("/auth/")({
	validateSearch: (search: Record<string, unknown>): { show?: string } => ({
		show: search.show as string | undefined,
	}),
	component: AuthComponent,
});

function AuthComponent() {
	const { show } = Route.useSearch();
	return (
		<AuthPage preBuiltUIList={preBuiltUIList} isSignUp={show === "signup"} />
	);
}
