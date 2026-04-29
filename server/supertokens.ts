import Session from "supertokens-node/recipe/session/index.js";
import EmailPassword from "supertokens-node/recipe/emailpassword/index.js";
import ThirdParty from "supertokens-node/recipe/thirdparty/index.js";
import { env } from "./env.ts";
import type { SuperTokensConfig } from "supertokens-node";
import UserMetadata from "supertokens-node/recipe/usermetadata";
import ProfileDetailsPlugin from "@supertokens-plugins/profile-details-nodejs";

export const supertokensConfig = {
	framework: "fastify",
	supertokens: {
		connectionURI: env.SUPERTOKENS_CONNECTION_URI,
		apiKey: env.SUPERTOKENS_API_KEY,
	},
	appInfo: {
		appName: env.VITE_APP_NAME,
		apiDomain: env.VITE_API_URL,
		websiteDomain: env.WEBSITE_DOMAIN,
		apiBasePath: "/auth",
		websiteBasePath: "/auth",
	},
	recipeList: [
		EmailPassword.init(),
		ThirdParty.init({
			signInAndUpFeature: {
				providers: [
					{
						config: {
							thirdPartyId: "google",
							clients: [
								{
									clientId: env.GOOGLE_CLIENT_ID ?? "",
									clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
								},
							],
						},
					},
					{
						config: {
							thirdPartyId: "github",
							clients: [
								{
									clientId: env.GITHUB_CLIENT_ID ?? "",
									clientSecret: env.GITHUB_CLIENT_SECRET ?? "",
								},
							],
						},
					},
				],
			},
		}),
		Session.init(),
		UserMetadata.init(),
	],
	experimental: {
		plugins: [
			ProfileDetailsPlugin.init({
				sections: [
					{
						id: "preferences",
						label: "Preferences",
						description: "Customize your experience",
						fields: [
							{
								id: "avatar",
								label: "Profile Picture",
								type: "image-url",
								required: false,
								placeholder: "https://example.com/avatar.jpg",
							},
							{
								id: "theme",
								label: "Preferred Theme",
								type: "select",
								required: false,
								options: [
									{ value: "light", label: "Light" },
									{ value: "dark", label: "Dark" },
									{ value: "auto", label: "Auto" },
								],
								defaultValue: "auto",
							},
						],
					},
				],
				registerSectionsForProgressiveProfiling: true,
			}),
		],
	},
} satisfies SuperTokensConfig;
