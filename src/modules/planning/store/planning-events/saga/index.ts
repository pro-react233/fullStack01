import { all } from "redux-saga/effects";
import { loadPlanningEventsOnLoadingPlan } from "./loadPlanningEventsOnLoadingPlan";

export function* planningEventsSaga() {
    yield all([loadPlanningEventsOnLoadingPlan()]);
}
