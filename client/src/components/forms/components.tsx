import { useStore } from "@tanstack/react-form";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFieldContext, useFormContext } from "./form-context.ts";
import { Button } from "../ui/button.tsx";

const parseNumber = (value: string): number => parseInt(value);

export function TextField({
	label,
	orientation = "horizontal",
}: {
	label: string;
	orientation?: "horizontal" | "vertical";
}) {
	const field = useFieldContext<string>();

	const errors = useStore(field.store, (state) => state.meta.errors);

	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return (
		<FieldGroup>
			<Field data-invalid={isInvalid} orientation={orientation}>
				<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
				<Input
					id={field.name}
					name={field.name}
					value={field.state.value}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
					placeholder={label}
				/>
				{isInvalid && <FieldError errors={errors} />}
			</Field>
		</FieldGroup>
	);
}

export function NumberField({
	label,
	orientation = "horizontal",
	min,
	max,
}: {
	label: string;
	orientation?: "horizontal" | "vertical";
	min?: number;
	max?: number;
}) {
	const field = useFieldContext<number>();

	const errors = useStore(field.store, (state) => state.meta.errors);

	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return (
		<FieldGroup>
			<Field data-invalid={isInvalid} orientation={orientation}>
				<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
				<Input
					id={field.name}
					name={field.name}
					value={field.state.value}
					onBlur={field.handleBlur}
					onChange={(e) =>
						field.handleChange(parseNumber(e.target.value))
					}
					type="number"
					min={min}
					max={max}
					placeholder={label}
				/>
			</Field>
			{isInvalid && <FieldError errors={errors} />}
		</FieldGroup>
	);
}

export function SubmitButton({ label }: { label: string }) {
	const form = useFormContext();
	return (
		<form.Subscribe
			selector={(state) => [state.canSubmit, state.isSubmitting]}
			children={([canSubmit, isSubmitting]) => (
				<Button type="submit" disabled={!canSubmit}>
					{isSubmitting ? "..." : label}
				</Button>
			)}
		/>
	);
}
