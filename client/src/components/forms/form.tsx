import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context";
import {
	NumberField,
	TextField,
	SubmitButton,
	SymbolField,
} from "./components";

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
