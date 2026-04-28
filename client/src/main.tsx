import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import ThirdParty, { Google, Github, Apple } from "supertokens-auth-react/recipe/thirdparty";
import Session from "supertokens-auth-react/recipe/session";
import { env } from "./env";
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

SuperTokens.init({
	appInfo: {
		appName: env.VITE_APP_NAME,
		apiDomain: env.VITE_API_URL,
		websiteDomain: env.VITE_WEBSITE_DOMAIN,
		apiBasePath: "/auth",
		websiteBasePath: "/auth",
	},

	recipeList: [
		EmailPassword.init({
            onHandleEvent: async (context) => {
                if (context.action === "SUCCESS") {
                    if (context.isNewRecipeUser && context.user.loginMethods.length === 1) {
                        // TODO: Sign up
                    } else {
                        // TODO: Sign in
                    }
                }
            }
        }),
		// ThirdParty.init({
		// 	signInAndUpFeature: {
		// 		providers: [Google.init(), Github.init(), Apple.init()],
		// 	},
		// }),
		Session.init(),
	],

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
