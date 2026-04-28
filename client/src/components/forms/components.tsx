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

export function NumberField({ label }: { label: string }) {
	const field = useFieldContext<number>();

	const errors = useStore(field.store, (state) => state.meta.errors);

	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return (
		<FieldGroup>
			<Field data-invalid={isInvalid} orientation="horizontal">
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
					min={3}
					placeholder="Size"
				/>
				{isInvalid && <FieldError errors={errors} />}
			</Field>
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
