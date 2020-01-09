import { runRequestAsSaga } from "@store/utils";
import { Action } from "redux";
import { takeEvery } from "redux-saga/effects";
import { getPlanByIdRequest, getPlanningEventsRequest } from "../../../api";

export function* loadPlanningEventsOnLoadingPlan() {
    yield takeEvery(
        (a: Action) => getPlanByIdRequest.actions.isRunning(a),
        function*(a: Action) {
            if (!getPlanByIdRequest.actions.isRunning(a)) {
                return;
            }

            try {
                yield* runRequestAsSaga(getPlanningEventsRequest, {
                    planId: +a.params.id
                });
            } catch (e) {
                console.error(e);
            }
        }
    );
}
