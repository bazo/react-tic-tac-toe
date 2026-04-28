import type { Settings } from "../types";
import { useAppForm } from "@/components/forms/form";

interface Props {
	onSubmit: (settings: Settings) => void;
	initialSettings: Settings;
	className?: string;
}

export function SettingsForm({ onSubmit, initialSettings, className }: Props) {
	const form = useAppForm({
		defaultValues: initialSettings,
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
			<div className="flex gap-2 justify-center">
				<form.AppField
					name="size"
					children={(field) => <field.NumberField label="Size" />}
				/>

				<form.AppField
					name="toWin"
					children={(field) => <field.NumberField label="To win" />}
				/>

				<form.AppForm>
					<form.SubmitButton label="Ok" />
				</form.AppForm>
			</div>
		</form>
	);
}

export default SettingsForm;
