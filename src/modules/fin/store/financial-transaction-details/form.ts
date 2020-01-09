import { specialFields } from "@utils";
import { createForm, fields, reactBinding } from "rd-redux-forms";
import { FinancialAttribte, FinancialTransactionFields } from "../../api";

export interface FinancialTransactionFormFields
    extends FinancialTransactionFields {
    attributes: FinancialAttribte[];
}

export const finTransactionForm = createForm<
    FinancialTransactionFormFields,
    FinancialTransactionEditFormMeta
>("FIN TRANSACTION", {
    amount: {
        ...fields.float(2, true),
        formatForDisplay(value) {
            if (
                value === null ||
                value === undefined ||
                (value as any) === ""
            ) {
                return "";
            }

            return fields.float(2, true).formatForDisplay(value);
        },
        formatForEditing(value) {
            if (value === 0 || value === "0" || parseFloat(value) === 0) {
                return "";
            }

            return value;
        }
    },
    code: fields.any(),
    costCenterId: fields.any(),
    currency: fields.string(true),
    description: fields.string(false),
    occurredAt: specialFields.momentDate(true),
    attributes: fields.any(),
    externalTransactionId: fields.string(false),
    correlatedTransactionId: fields.int(false)
});
export interface FinancialTransactionEditFormMeta {
    id: string;
}

export const finTransactionFormBindings = reactBinding()
    .default()
    .withForm(finTransactionForm);
