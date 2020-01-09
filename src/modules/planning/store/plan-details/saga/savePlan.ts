import { toFormValidationErrors } from "@api/common";
import { AppState } from "@store";
import { runRequestWithBodyAsSaga } from "@store/utils";
import { sort } from "@utils";
import { FetchingState } from "rd-redux-http";
import { replace } from "react-router-redux";
import { Action } from "redux";
import { put, select, takeEvery } from "redux-saga/effects";
import { PlanData, postPlanRequest } from "../../../api";
import { PlanDetailsUrl } from "../../../urls";
import { planForm, scheduleForm } from "../forms";
import { isTemporaryScheduleId } from "../schedule-id-generator";
import { scheduleFormSelector, scheduleIdSelector } from "../selectors";

function* savePlanSaga(action: Action) {
    if (!planForm.actions.isValidate(action)) {
        return;
    }

    const appState: AppState = yield select();

    const state = appState.planning.planDetails.plans[action.meta.id];
    if (!state) {
        return;
    }

    const originalPlan = FetchingState.getDataOrDefault(state.data, undefined);

    const form = planForm.selector(
        state.form,
        originalPlan ? originalPlan.plan : undefined
    );
    if (!form.isValid) {
        return;
    }

    const schedules = scheduleIdSelector(appState, action.meta.id).map(
        scheduleId => scheduleFormSelector(appState, action.meta.id, scheduleId)
    );

    if (schedules.some(s => !s.isValid)) {
        return;
    }

    try {
        const newPlanData: PlanData = {
            ...(originalPlan || {
                schedules: []
            }),
            plan: {
                ...form.data,
                id: action.meta.id === "new" ? 0 : parseInt(action.meta.id)
            },
            schedules: schedules
                .map(s => s.isValid && s.data)
                .map(s =>
                    isTemporaryScheduleId(s.id.toString())
                        ? {
                              ...s,
                              id: undefined
                          }
                        : s
                )
                .map(s =>
                    s.attributes
                        ? s
                        : {
                              ...s,
                              attributes: []
                          }
                )
        };

        const result: PlanData = yield runRequestWithBodyAsSaga(
            postPlanRequest,
            {},
            newPlanData
        );

        if (result.plan && result.plan.id) {
            yield put(
                replace(
                    PlanDetailsUrl.format({ id: result.plan.id.toString() })
                )
            );
        }
    } catch (e) {
        console.error(e);
        try {
            const error = e as Action;
            if (postPlanRequest.actions.isErrorResponse(error)) {
                const fieldErrors = toFormValidationErrors(error.error);

                yield put(
                    planForm.actions.setErrors(
                        { fields: fieldErrors },
                        action.meta
                    )
                );

                const appState: AppState = yield select();

                const schedules = sort(
                    scheduleIdSelector(appState, action.meta.id)
                        .map(key =>
                            scheduleFormSelector(appState, action.meta.id, key)
                        )
                        .map(f => f.isValid && f.data),
                    e => e.ordinal
                );

                for (let i = 0; i < schedules.length; i++) {
                    const schedule = schedules[i];
                    const prefix = `schedules[${i}]`;
                    const errors = toFormValidationErrors(error.error, prefix);
                    if (Object.keys(errors).length) {
                        yield put(
                            scheduleForm.actions.setErrors(
                                {
                                    fields: errors
                                },
                                {
                                    id: action.meta.id,
                                    scheduleId: schedule.id.toString()
                                }
                            )
                        );
                    }
                }
            }
        } catch (e1) {
            console.error(e1);
        }
    }
}

export function* savePlan() {
    yield takeEvery(
        (action: Action) => planForm.actions.isValidate(action),
        savePlanSaga
    );
}
