import { useAppForm } from "@/components/forms/form";
import { SettingsFields } from "@/game/components/settings-form";
import type { Settings } from "@/game/types";
import { CreateRoomSchema } from "shared/schemas";
interface RoomSettings extends Settings {
	name: string;
}

interface RoomFormProps {
	initialSettings: RoomSettings;
	onSubmit: (settings: RoomSettings) => void;
	className?: string;
}

export function RoomForm({
	onSubmit,
	initialSettings,
	className,
}: RoomFormProps) {
	const form = useAppForm({
		defaultValues: initialSettings,
		validators: {
			onSubmit: CreateRoomSchema,
			onBlur: CreateRoomSchema,
			onChange: CreateRoomSchema,
		},
		onSubmit: async ({ value }) => {
			onSubmit(value);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className={className}
		>
			<div className="flex flex-col gap-2 justify-center">
				<form.AppField
					name="name"
					children={(field) => <field.TextField label="Name" />}
				/>
				<div className="flex gap-2 justify-center">
					<SettingsFields
						form={form}
						fields={{ size: "size", toWin: "toWin" }}
					/>
					<form.AppForm>
						<form.SubmitButton label="Create" />
					</form.AppForm>
				</div>
			</div>
		</form>
	);
}
