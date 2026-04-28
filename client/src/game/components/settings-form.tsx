import type { Settings } from "../types";
import { useAppForm, withFieldGroup } from "@/components/forms/form";

export const initialSettings = { size: 5, toWin: 3 } as Settings;

export const SettingsFields = withFieldGroup({
	defaultValues: initialSettings,
	render: ({ group }) => {
		return (
			<>
				<group.AppField
					name="size"
					children={(field) => (
						<field.NumberField label="Size" min={3} />
					)}
				/>

				<group.AppField
					name="toWin"
					children={(field) => (
						<group.Subscribe
							selector={(state) => state.values.size}
							children={(size) => (
								<field.NumberField
									label="To win"
									min={3}
									max={size}
								/>
							)}
						/>
					)}
				/>
			</>
		);
	},
});

export interface SettingsFormProps {
	onSubmit: (settings: Settings) => void;
	initialSettings: Settings;
	className?: string;
}

export function SettingsForm({
	onSubmit,
	initialSettings,
	className,
}: SettingsFormProps) {
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
				<SettingsFields
					form={form}
					fields={{ size: "size", toWin: "toWin" }}
				/>
				<form.AppForm>
					<form.SubmitButton label="Ok" />
				</form.AppForm>
			</div>
		</form>
	);
}

export default SettingsForm;
