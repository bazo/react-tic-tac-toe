import styled from "@emotion/styled";
import React, { FC, ReactElement } from "react";
import { Field, Form } from "react-final-form";

import { Settings } from "../types";

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
			transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

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

const SettingsForm: FC<Props> = ({ onSubmit, initialSettings, className }: Props) => {
	return (
		<Form
			onSubmit={onSubmit}
			initialValues={initialSettings}
			render={({ handleSubmit, submitting, pristine, values }): ReactElement => (
				<StyledForm onSubmit={handleSubmit} className={className}>
					<div>
						<label>Size</label>
						<Field name="size" component="input" type="number" min={3} placeholder="Size" parse={parseNumber} />
					</div>

					<div>
						<label>To win</label>
						<Field name="toWin" component="input" type="number" min={3} max={values.size} placeholder="To win" parse={parseNumber} />
					</div>

					<div className="buttons">
						<button type="submit" disabled={submitting || pristine}>
							OK
						</button>
					</div>
				</StyledForm>
			)}
		/>
	);
};

export default SettingsForm;
