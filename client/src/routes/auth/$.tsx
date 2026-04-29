import { createFileRoute } from "@tanstack/react-router";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import { canHandleRoute, getRoutingComponent } from "supertokens-auth-react/ui";

const preBuiltUIList = [EmailPasswordPreBuiltUI, ThirdPartyPreBuiltUI];

export const Route = createFileRoute("/auth/$")({
	component: AuthCatchAll,
});

function AuthCatchAll() {
	if (canHandleRoute(preBuiltUIList)) {
		return getRoutingComponent(preBuiltUIList);
	}
	return null;
}
