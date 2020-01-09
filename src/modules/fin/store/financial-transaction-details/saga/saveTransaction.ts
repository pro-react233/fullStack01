import {
    FinancialTransactionInfo,
    FinTransactionDetailsUrl,
    finTransactionForm,
    postTransactionRequest
} from "@fin";
import { AppState } from "@store";
import { runRequestWithBodyAsSaga } from "@store/utils";
import { replace } from "react-router-redux";
import { Action } from "redux";
import { put, select } from "redux-saga/effects";
import { FetchingState } from "rd-redux-http";
import { toFormValidationErrors } from "@api/common";

export function* saveTransaction(action: Action) {
    if (!finTransactionForm.actions.isValidate(action)) {
        return;
    }

    const appState: AppState = yield select();
    const finTransState =
        appState.fin.financialTransactionDetails.finTransactions[
            action.meta.id
        ];
    const form = finTransactionForm.selector(
        finTransState.form,
        FetchingState.getDataOrDefault(finTransState.data, undefined)
    );

    if (!form.isValid) {
        return;
    }

    try {
        const result: FinancialTransactionInfo = yield runRequestWithBodyAsSaga(
            postTransactionRequest,
            {
                id: action.meta.id
            },
            {
                transaction: {
                    ...form.data,
                    id:
                        action.meta.id === "new"
                            ? undefined
                            : parseInt(action.meta.id),
                    correlatedTransactionId: form.data.correlatedTransactionId
                        ? form.data.correlatedTransactionId
                        : null,
                    externalTransactionId:
                        form.data.externalTransactionId &&
                        form.data.externalTransactionId.trim()
                            ? form.data.externalTransactionId
                            : null
                },
                attributes: form.data.attributes || []
            }
        );

        if (result.id) {
            yield put(
                replace(
                    FinTransactionDetailsUrl.format({
                        id: result.id.toString()
                    })
                )
            );
        }
    } catch (e) {
        console.error(e);

        try {
            const error = e as Action;
            if (postTransactionRequest.actions.isErrorResponse(error)) {
                const fieldErrors = toFormValidationErrors(error.error);

                yield put(
                    finTransactionForm.actions.setErrors(
                        {
                            fields: fieldErrors
                        },
                        action.meta
                    )
                );
            }
        } catch (e1) {
            console.error(e1);
        }
    }
}
