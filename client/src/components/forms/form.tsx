import { createFormHook } from "@tanstack/react-form";

import { NumberField, TextField, SubmitButton, SymbolField } from "./components";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
	fieldComponents: {
		NumberField,
		TextField,
		SymbolField,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
});
