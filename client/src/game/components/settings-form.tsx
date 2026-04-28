import { useForm } from "@tanstack/react-form";
import type { Settings } from "../types";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface Props {
	onSubmit: (settings: Settings) => void;
	initialSettings: Settings;
	className?: string;
}

const parseNumber = (value: string): number => parseInt(value);

export function SettingsForm({ onSubmit, initialSettings, className }: Props) {
	const form = useForm({
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
				<FieldGroup>
					<form.Field
						name="size"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched &&
								!field.state.meta.isValid;
							return (
								<Field
									data-invalid={isInvalid}
									orientation="horizontal"
								>
									<FieldLabel htmlFor={field.name}>
										Size
									</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(
												parseNumber(e.target.value),
											)
										}
										type="number"
										min={3}
										placeholder="Size"
									/>
								</Field>
							);
						}}
					/>
				</FieldGroup>

				<FieldGroup>
					<form.Field
						name="toWin"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched &&
								!field.state.meta.isValid;
							return (
								<Field
									data-invalid={isInvalid}
									orientation="horizontal"
								>
									<FieldLabel htmlFor={field.name}>
										To win
									</FieldLabel>
									<form.Subscribe
										selector={(state) => state.values.size}
										children={(size) => (
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(
														parseNumber(
															e.target.value,
														),
													)
												}
												type="number"
												min={3}
												max={size}
												placeholder="To win"
											/>
										)}
									/>
								</Field>
							);
						}}
					/>
				</FieldGroup>

				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<Button type="submit" disabled={!canSubmit}>
							{isSubmitting ? "..." : "Ok"}
						</Button>
					)}
				/>
			</div>
		</form>
	);
}

export default SettingsForm;
