import { Action } from "redux";
import { put, select, takeEvery } from "redux-saga/effects";
import { planForm, scheduleForm } from "../forms";
import { scheduleIdSelector } from "../selectors";

export function* validateScheduleFormOnValidatingPlanForms() {
    yield takeEvery((a: Action) => planForm.actions.isValidate(a), function*(
        action: Action
    ) {
        if (planForm.actions.isValidate(action)) {
            const state = yield select();
            const scheduleIds = scheduleIdSelector(state, action.meta.id);

            for (const scheduleId of scheduleIds) {
                yield put(
                    scheduleForm.actions.validate({
                        id: action.meta.id,
                        scheduleId: scheduleId
                    })
                );
            }
        }
    });
}
