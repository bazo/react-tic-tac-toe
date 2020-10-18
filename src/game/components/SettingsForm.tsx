import React, { FC, ReactElement } from "react";
import { Field, Form } from "react-final-form";

import { Settings } from "../types";

interface Props {
	onSubmit: (settings: Settings) => void;
	initialSettings: Settings;
}

const parseNumber = (value: string): number => parseInt(value);

const SettingsForm: FC<Props> = ({ onSubmit, initialSettings }: Props) => {
	return (
		<Form
			onSubmit={onSubmit}
			initialValues={initialSettings}
			render={({ handleSubmit, form, submitting, pristine, values }): ReactElement => (
				<form onSubmit={handleSubmit}>
					<div>
						<label>Size</label>
						<Field name="size" component="input" type="number" min={3} placeholder="Size" parse={parseNumber} />
					</div>

					<div className="buttons">
						<button type="submit" disabled={submitting || pristine}>
							OK
						</button>
					</div>
				</form>
			)}
		/>
	);
};

export default SettingsForm;
