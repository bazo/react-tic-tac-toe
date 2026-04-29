import { useStore } from "@tanstack/react-form";
import { SymbolText } from "shared/game-symbols";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Button } from "../ui/button.tsx";
import { useFieldContext, useFormContext } from "./form-context.ts";

const parseNumber = (value: string): number => parseInt(value);

export function TextField({
	label,
	orientation = "horizontal",
	disabled,
}: {
	label: string;
	orientation?: "horizontal" | "vertical";
	disabled?: boolean;
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
					disabled={disabled}
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
					onChange={(e) => field.handleChange(parseNumber(e.target.value))}
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

export function SymbolField({
	label,
	orientation = "horizontal",
}: {
	label: string;
	orientation?: "horizontal" | "vertical";
}) {
	const field = useFieldContext<SymbolText>();

	const errors = useStore(field.store, (state) => state.meta.errors);

	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return (
		<FieldGroup>
			<Field data-invalid={isInvalid} orientation={orientation}>
				<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
				<div
					onClick={() => field.handleChange(SymbolText.CROSS)}
					className={`flex items-center justify-center w-10 h-10 text-4xl cursor-pointer rounded ${field.state.value === SymbolText.CROSS ? "border-2 border-primary" : ""}`}
				>
					{SymbolText.CROSS}
				</div>
				<div
					onClick={() => field.handleChange(SymbolText.CIRCLE)}
					className={`flex items-center justify-center w-10 h-10 text-4xl cursor-pointer rounded ${field.state.value === SymbolText.CIRCLE ? "border-2 border-primary" : ""}`}
				>
					{SymbolText.CIRCLE}
				</div>
			</Field>
			{isInvalid && <FieldError errors={errors} />}
		</FieldGroup>
	);
}
