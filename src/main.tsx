import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "./components/theme-provider";
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

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="system">
			<RouterProvider router={router} />
		</ThemeProvider>
	</StrictMode>,
);
