import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import {
    defaultPlanListState,
    planListReducer,
    planListSaga
} from "./plan-list";
import {
    AllPlanDataState,
    planDetailsReducer,
    planDetailsSaga
} from "./plan-details";
import {
    PlanningEventsState,
    planningEventReducer,
    planningEventsSaga
} from "./planning-events";

export interface PlanningModuleState {
    planList: typeof defaultPlanListState;
    planDetails: AllPlanDataState;
    planningEvents: PlanningEventsState;
}

export const planningModuleReducer = combineReducers<PlanningModuleState>({
    planList: planListReducer,
    planDetails: planDetailsReducer,
    planningEvents: planningEventReducer
});

export function* planningModuleSaga() {
    yield all([planListSaga(), planDetailsSaga(), planningEventsSaga()]);
}
