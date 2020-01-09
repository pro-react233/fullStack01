import { combineReducersPartial } from "rd-redux-utils";

import {
    PlanningFinancialResultsState,
    planningFinancialResultsReportReducer,
    planningFinancialResultsSaga
} from "./planning-financial-results";
import { FetchingState } from "rd-redux-http";
import { all } from "redux-saga/effects";
import {
    PlanFactFinResultsReportState,
    planFactFinResultsReportReducer,
    planFactFinResultsReportSaga
} from "./plan-fact-fin-results-report";

export interface ReportsState {
    planningFinancialResults: PlanningFinancialResultsState;
    planFactFinResults: PlanFactFinResultsReportState;
}

export const reportsReducer = combineReducersPartial<ReportsState>(
    {
        planningFinancialResults: planningFinancialResultsReportReducer,
        planFactFinResults: planFactFinResultsReportReducer
    },
    {
        planningFinancialResults: {
            fetchState: FetchingState.INITIAL
        },
        planFactFinResults: {
            report: {
                fetchState: FetchingState.INITIAL
            },
            monthly: {}
        }
    }
);

export function* reportsSaga() {
    yield all([planningFinancialResultsSaga(), planFactFinResultsReportSaga()]);
}
