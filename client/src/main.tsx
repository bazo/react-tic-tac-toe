//import ThirdParty, { Google, Github, Apple } from "supertokens-auth-react/recipe/thirdparty";
import ProfileBasePlugin from "@supertokens-plugins/profile-base-react";
import ProfileDetailsPlugin from "@supertokens-plugins/profile-details-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

import { ThemeProvider } from "./components/theme-provider";
import { env } from "./env";
import { routeTree } from "./routeTree.gen";

import "./style.css";

// Register things for typesafety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	scrollRestoration: true,
});

const queryClient = new QueryClient();

console.log(import.meta.env, import.meta, window.location);

SuperTokens.init({
	appInfo: {
		appName: env.VITE_APP_NAME,
		apiDomain: import.meta.env.DEV ? env.VITE_API_URL : window.location.origin,
		websiteDomain: window.location.origin,
		apiBasePath: "/auth",
		websiteBasePath: "/auth",
	},

	recipeList: [
		EmailPassword.init({
			onHandleEvent: async (context) => {
				console.log({ context });
				if (context.action === "SUCCESS") {
					await fetch(`${env.VITE_API_URL}/api/me`, {
						method: "POST",
					});
				}
			},
		}),
		// ThirdParty.init({
		// 	signInAndUpFeature: {
		// 		providers: [Google.init(), Github.init(), Apple.init()],
		// 	},
		// }),
		Session.init(),
	],
	experimental: {
		plugins: [
			ProfileBasePlugin.init({
				profilePagePath: "/user/profile",
			}),
			ProfileDetailsPlugin.init(),
		],
	},
	getRedirectionURL: async (context) => {
		if (context.action === "SUCCESS" && context.newSessionCreated) {
			return "/";
		}
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<SuperTokensWrapper>
			<ThemeProvider defaultTheme="system">
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</ThemeProvider>
		</SuperTokensWrapper>
	</StrictMode>,
);
