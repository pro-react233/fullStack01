import { apiUrl, customFetch } from "@api/common";
import { http, reduxHttpMiddlewareFactory } from "rd-redux-http";

const reduxMw = reduxHttpMiddlewareFactory();

export const planFactFinResultsReportRequest = reduxMw.register(
    http
        .get<{ currency: string }>(
            apiUrl("/report/monthly-plan-fact-results/:currency")
        )
        .withFetch(customFetch)
        .resultFromJson<PlanFactFinResultsReportRecord[]>()
        .build()
);

export interface PlanFactFinResultsReportRecord {
    occurredAtMonth: string;
    planMonthlyTotal: number;
    planMonthlyIncome: number;
    planMonthlyExpence: number;
    factMonthlyTotal: number;
    factMonthlyIncome: number;
    factMonthlyExpence: number;
    currency: string;
}
