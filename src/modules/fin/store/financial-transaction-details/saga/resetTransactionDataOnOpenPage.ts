import { LocationChangeAction } from "react-router-redux";
import { FinTransactionDetailsUrl } from "@fin";
import { put } from "redux-saga/effects";
import { finTransactionForm } from "../form";

export function* resetTransactionDataOnOpenPage(action: LocationChangeAction) {
    const urlMatch = FinTransactionDetailsUrl.match(action.payload, true);

    if (urlMatch.isMatched)
        if (urlMatch.params.id === "new") {
            yield put(
                finTransactionForm.actions.setData(
                    {
                        amount: 0,
                        code: 0,
                        costCenterId: 0,
                        currency: "UAH",
                        occurredAt: new Date().toISOString()
                    },
                    true,
                    { id: "new" }
                )
            );
        } else {
            yield put(finTransactionForm.actions.setData({}, true, { id: urlMatch.params.id }));
        }
}
