import {
    planFactFinResultsReportRequest,
    getPlanningEventsAtMonthRequest,
    getFinTransAtMonthRequest
} from "../../api";

export interface PlanFactFinResultsReportState {
    report: typeof planFactFinResultsReportRequest.types.reduxState;
    monthly: {
        [month: string]: MonthlyInfoState;
    };
}

export interface MonthlyInfoState {
    events: typeof getPlanningEventsAtMonthRequest.types.reduxState;
    transactions: typeof getFinTransAtMonthRequest.types.reduxState;
}
