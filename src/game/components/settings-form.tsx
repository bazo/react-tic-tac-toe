import styled from "@emotion/styled";
import { useForm } from "@tanstack/react-form";
import type { Settings } from "../types";

const StyledForm = styled.form`
	display: flex;
	justify-content: center;
	margin-bottom: 20px;

	div {
		margin-right: 10px;

		label {
			text-align: left;
			width: 100%;
			margin-right: 10px;
		}

		input[type="number"] {
			width: 50px;
			text-align: center;
			padding: 5px;
		}

		button {
			color: #fff;
			height: 100%;
			background-color: #007bff;
			border-color: #007bff;
			vertical-align: middle;
			border-radius: 0.25rem;
			transition:
				color 0.15s ease-in-out,
				background-color 0.15s ease-in-out,
				border-color 0.15s ease-in-out,
				box-shadow 0.15s ease-in-out;

			&[disabled] {
				color: #ccc;
			}
		}
	}
`;

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
		<StyledForm
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className={className}
		>
			<div>
				<form.Field
					name="size"
					children={(field) => {
						return (
							<>
								<label htmlFor={field.name}>Size</label>
								<input
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
							</>
						);
					}}
				/>
			</div>

			<div>
				<form.Field
					name="toWin"
					children={(field) => {
						return (
							<>
								<label htmlFor={field.name}>To win</label>
								<input
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
									max={field.form.state.values.size}
									placeholder="To win"
								/>
							</>
						);
					}}
				/>
			</div>

			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting]}
				children={([canSubmit, isSubmitting]) => (
					<div className="buttons">
						<button type="submit" disabled={!canSubmit}>
							{isSubmitting ? "..." : "Ok"}
						</button>
					</div>
				)}
			/>
		</StyledForm>
	);
}

export default SettingsForm;
