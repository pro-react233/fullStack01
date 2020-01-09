import { PlanDetailsUrl } from "@planning";
import { AppState } from "@store";
import { runRequestAsSaga } from "@store/utils";
import { FetchingState } from "rd-redux-http";
import { LocationChangeAction, LOCATION_CHANGE } from "react-router-redux";
import { Action } from "redux";
import { put, select, take, takeEvery } from "redux-saga/effects";
import { getPlanByIdRequest } from "../../../api";
import { addScheduleAction, removeAllSchedulesAction } from "../actions";
import { planForm } from "../forms";
import { PlanDataState } from "../state";

function* resetNewPlanData(action: LocationChangeAction) {
    const match = PlanDetailsUrl.match(action.payload, true);
    if (!match.isMatched) {
        return;
    }

    if (match.params.id !== "new") {
        return;
    }

    if (match.query && match.query.copyFromPlan) {
        const copyFromPlanId = match.query.copyFromPlan;
        const planState: PlanDataState = yield* awaitPlanLoading(
            copyFromPlanId
        );

        if (planState && FetchingState.isSuccess(planState.data)) {
            const plan = planState.data.data;
            yield put(
                planForm.actions.setData(
                    {
                        ...JSON.parse(JSON.stringify(plan.plan)),
                        name: `Copy of ${plan.plan.name}`
                    },
                    true,
                    { id: "new" }
                )
            );

            yield put(removeAllSchedulesAction({ id: "new" }));

            for (const schedule of plan.schedules) {
                yield put(
                    addScheduleAction({
                        id: "new",
                        scheduleData: JSON.parse(JSON.stringify(schedule))
                    })
                );
            }
        }
    } else {
        yield put(planForm.actions.setData({}, true, { id: "new" }));
        yield put(removeAllSchedulesAction({ id: "new" }));
        yield put(addScheduleAction({ id: "new" }));
    }
}

function* awaitPlanLoading(planId: string) {
    let planState: PlanDataState = yield select(
        (appState: AppState) => appState.planning.planDetails.plans[planId]
    );
    if (!planState) {
        yield* runRequestAsSaga(getPlanByIdRequest, { id: planId });
    }

    planState = yield select(
        (appState: AppState) => appState.planning.planDetails.plans[planId]
    );

    if (FetchingState.isInitialOrFetching(planState.data)) {
        yield take((a: Action) => getPlanByIdRequest.actions.isOk(a));
    }

    planState = yield select(
        (appState: AppState) => appState.planning.planDetails.plans[planId]
    );

    if (FetchingState.isError(planState.data)) {
        return undefined;
    }

    return planState;
}

export function* resetNewPlanDataOnNavigating() {
    yield takeEvery(
        (a: Action) =>
            a.type === LOCATION_CHANGE &&
            PlanDetailsUrl.match((a as LocationChangeAction).payload, true)
                .isMatched,
        resetNewPlanData
    );
}
