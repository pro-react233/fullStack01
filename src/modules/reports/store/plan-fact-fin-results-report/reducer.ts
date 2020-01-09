import { FetchingState } from "rd-redux-http";
import { combineReducersPartial } from "rd-redux-utils";
import {
    getFinTransAtMonthRequest,
    getPlanningEventsAtMonthRequest,
    planFactFinResultsReportRequest
} from "../../api";
import { planFactReportsActionGroup } from "./actions";
import { MonthlyInfoState, PlanFactFinResultsReportState } from "./state";

export const planFactFinResultsReportReducer = combineReducersPartial<
    PlanFactFinResultsReportState
>({
    report: planFactFinResultsReportRequest.reducer,
    monthly: planFactReportsActionGroup.hashedReducer(
        a => a.month,
        combineReducersPartial<MonthlyInfoState>(
            {
                events: getPlanningEventsAtMonthRequest.reducer,
                transactions: getFinTransAtMonthRequest.reducer
            },
            {
                events: {
                    fetchState: FetchingState.INITIAL
                },
                transactions: {
                    fetchState: FetchingState.INITIAL
                }
            }
        )
    )
});
