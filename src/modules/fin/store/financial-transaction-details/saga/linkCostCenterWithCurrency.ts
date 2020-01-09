import { all, takeEvery, select, put } from "redux-saga/effects";
import { Action } from "redux";
import { finTransactionForm } from "../form";
import { AppState } from "@store";
import { FetchingState } from "rd-redux-http";

export function* linkCostCenterWithCurrency() {
    yield all([
        takeEvery(
            (a: Action) =>
                finTransactionForm.actions.isFieldEdit(a) &&
                (a.field === "currency" || a.field === "costCenterId"),
            function*(a: Action) {
                try {
                    if (!finTransactionForm.actions.isFieldEdit(a)) {
                        return;
                    }

                    const appState: AppState = yield select();

                    const costCenters = FetchingState.getDataOrDefault(
                        appState.refs.costCenters,
                        []
                    );

                    if (!costCenters.length) {
                        return;
                    }

                    if (a.field === "costCenterId") {
                        const cc = costCenters.find(
                            c => c.id.toString() === a.value.toString()
                        );
                        if (cc && cc.currency) {
                            yield put(
                                finTransactionForm.actions.setData(
                                    {
                                        currency: cc.currency
                                    },
                                    false,
                                    a.meta,
                                    true
                                )
                            );
                        }
                    }

                    if (a.field === "currency" && a.value) {
                        const transaction = finTransactionForm.selector(
                            appState.fin.financialTransactionDetails
                                .finTransactions[a.meta.id].form,
                            FetchingState.getDataOrDefault(
                                appState.fin.financialTransactionDetails
                                    .finTransactions[a.meta.id].data,
                                undefined
                            )
                        );

                        const costCenterId =
                            transaction.fields.costCenterId.value;

                        const ccWithCurrency = costCenters.filter(
                            cc => cc.currency === a.value
                        );

                        if (
                            ccWithCurrency.length &&
                            !ccWithCurrency.some(
                                c => c.id.toString() === `${costCenterId}`
                            )
                        ) {
                            yield put(
                                finTransactionForm.actions.setData(
                                    {
                                        costCenterId: ccWithCurrency[0].id
                                    },
                                    false,
                                    a.meta,
                                    true
                                )
                            );
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        )
    ]);
}
