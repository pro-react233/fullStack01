import { takeEvery, put, call } from "redux-saga/effects";
import { Action } from "redux";
import { LOCATION_CHANGE, LocationChangeAction } from "react-router-redux";
import { PlanDetailsUrl, getPlanByIdRequest } from "@planning";

function* loadPlanDetailsData(action: LocationChangeAction) {
    const match = PlanDetailsUrl.match(action.payload, true);
    if (!match.isMatched) {
        return;
    }

    const params = { id: match.params.id };

    if (match.params.id === "new") {
        return;
    }

    yield put(getPlanByIdRequest.actions.running(params));

    const result: typeof getPlanByIdRequest.types.response = yield call(getPlanByIdRequest, params);

    if (result.ok) {
        yield put(getPlanByIdRequest.actions.ok(params, result));
    } else {
        yield put(getPlanByIdRequest.actions.error(params, result as any));
    }
}

export function* loadPlanDetailsOnNavigating() {
    yield takeEvery(
        (a: Action) =>
            a.type === LOCATION_CHANGE && PlanDetailsUrl.match((a as LocationChangeAction).payload, true).isMatched,
        loadPlanDetailsData
    );
}
