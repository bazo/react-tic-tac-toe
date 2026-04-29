import { createFileRoute, redirect } from "@tanstack/react-router";
import { UpdateProfileSchema } from "shared/schemas";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";

import { useProfile, useUpdateProfile } from "@/api";
import { useAppForm } from "@/components/forms/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/profile")({
	beforeLoad: async () => {
		const exists = await doesSessionExist();
		if (!exists) {
			throw redirect({ to: "/auth" });
		}
	},
	component: ProfilePage,
});

function ProfilePage() {
	const { data: profile, isLoading } = useProfile();
	const updateMutation = useUpdateProfile();

	if (isLoading || !profile) {
		return <div className="py-8 text-center text-muted-foreground">Loading profile...</div>;
	}

	return (
		<div className="mx-auto max-w-lg py-8">
			<Card>
				<CardHeader>
					<CardTitle>Profile</CardTitle>
					<CardDescription>Update your display name</CardDescription>
				</CardHeader>
				<Separator />
				<CardContent>
					<ProfileForm
						nickname={profile.nickname}
						onSubmit={(data) => updateMutation.mutate(data)}
						error={updateMutation.error?.message}
						isPending={updateMutation.isPending}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

function ProfileForm({
	nickname,
	onSubmit,
	error,
	isPending,
}: {
	nickname: string;
	onSubmit: (data: { nickname: string }) => void;
	error?: string;
	isPending: boolean;
}) {
	const form = useAppForm({
		defaultValues: { nickname },
		validators: {
			onSubmit: UpdateProfileSchema,
		},
		onSubmit: async ({ value }) => {
			onSubmit({ nickname: value.nickname });
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<div className="flex flex-col gap-4">
				<form.AppField
					name="nickname"
					children={(field) => <field.TextField label="Nickname" />}
				/>

				{error && <p className="text-sm text-destructive">{error}</p>}

				<form.AppForm>
					<form.SubmitButton label={isPending ? "Saving..." : "Save"} />
				</form.AppForm>
			</div>
		</form>
	);
}
