import { all, takeEvery, select, put } from "redux-saga/effects";
import { Action } from "redux";
import { AppState } from "@store";
import { FetchingState } from "rd-redux-http";
import { scheduleForm } from "../forms";

export function* linkCostCenterWithCurrency() {
    yield all([
        takeEvery(
            (a: Action) =>
                scheduleForm.actions.isFieldEdit(a) &&
                (a.field === "currency" || a.field === "costCenterId"),
            function*(a: Action) {
                try {
                    if (!scheduleForm.actions.isFieldEdit(a)) {
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
                                scheduleForm.actions.setData(
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
                        const plan = FetchingState.getDataOrDefault(
                            appState.planning.planDetails.plans[a.meta.id].data,
                            undefined
                        );

                        const schedule = scheduleForm.selector(
                            appState.planning.planDetails.plans[a.meta.id]
                                .scheduleForms[a.meta.scheduleId],
                            plan
                                ? plan.schedules.find(
                                      s => s.id.toString() === a.meta.scheduleId
                                  )
                                : undefined
                        );

                        const costCenterId = schedule.fields.costCenterId.value;

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
                                scheduleForm.actions.setData(
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
