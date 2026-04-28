import { useAppForm } from "@/components/forms/form";
import { SettingsFields } from "@/game/components/settings-form";
import type { Settings } from "shared/game/types";
import { SymbolText } from "shared/game-symbols";
import { CreateGameSchema } from "shared/schemas";
interface GameSettings extends Settings {
	name: string;
	symbol: typeof SymbolText.CROSS | typeof SymbolText.CIRCLE;
}

interface GameFormProps {
	initialSettings: GameSettings;
	onSubmit: (settings: GameSettings) => void;
	className?: string;
}

export function GameForm({
	onSubmit,
	initialSettings,
	className,
}: GameFormProps) {
	const form = useAppForm({
		defaultValues: initialSettings,
		validators: {
			onSubmit: CreateGameSchema,
			onBlur: CreateGameSchema,
			onChange: CreateGameSchema,
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
				<div className="flex gap-2 justify-center">
					<form.AppField
						name="name"
						children={(field) => <field.TextField label="Name" />}
					/>
					<form.AppField
						name="symbol"
						children={(field) => (
							<field.SymbolField label="Symbol" />
						)}
					/>
				</div>
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
