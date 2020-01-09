import { FinTransactionDetailsUrl } from "@fin";
import { LocationChangeAction, LOCATION_CHANGE } from "react-router-redux";
import { Action } from "redux";
import { all, takeEvery } from "redux-saga/effects";
import { finTransactionForm } from "../form";
import { loadTransactionDetailsOnNavigatingToPage } from "./loadTransactionDetailsOnNavigatingToPage";
import { resetTransactionDataOnOpenPage } from "./resetTransactionDataOnOpenPage";
import { saveTransaction } from "./saveTransaction";
import { linkCostCenterWithCurrency } from "./linkCostCenterWithCurrency";

export function* financialTransactionDetailsSaga() {
    yield all([
        takeEvery(
            (a: LocationChangeAction) =>
                a.type === LOCATION_CHANGE &&
                FinTransactionDetailsUrl.match(a.payload, true).isMatched,
            loadTransactionDetailsOnNavigatingToPage
        ),
        takeEvery(
            (a: LocationChangeAction) =>
                a.type === LOCATION_CHANGE &&
                FinTransactionDetailsUrl.match(a.payload, true).isMatched,
            function*(a: LocationChangeAction) {
                yield all([resetTransactionDataOnOpenPage(a)]);
            }
        ),
        takeEvery(
            (a: Action) => finTransactionForm.actions.isValidate(a),
            saveTransaction
        ),
        linkCostCenterWithCurrency()
    ]);
}
