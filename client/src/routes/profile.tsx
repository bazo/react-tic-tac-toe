import { createFileRoute, redirect } from "@tanstack/react-router";
import { doesSessionExist } from "supertokens-auth-react/recipe/session";
import { UpdateProfileSchema } from "shared/schemas";
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
			<h1 className="font-heading text-2xl font-semibold mb-6">Profile</h1>

			<Card>
				<CardHeader>
					<CardTitle>Account details</CardTitle>
					<CardDescription>Update your display name and email address.</CardDescription>
				</CardHeader>
				<Separator />
				<CardContent>
					<ProfileForm
						email={profile.email}
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
	email,
	nickname,
	onSubmit,
	error,
	isPending,
}: {
	email: string;
	nickname: string;
	onSubmit: (data: { nickname: string }) => void;
	error?: string;
	isPending: boolean;
}) {
	const form = useAppForm({
		defaultValues: { email, nickname },
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
					name="email"
					children={(field) => <field.TextField label="Email" disabled />}
				/>

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
