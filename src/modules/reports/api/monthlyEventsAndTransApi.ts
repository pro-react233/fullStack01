import { apiUrl, customFetch } from "@api/common";
import { http, reduxHttpMiddlewareFactory } from "rd-redux-http";
import { FinancialTransactionInfo } from "@fin";
import { PlanningEventInfo } from "@planning";

const reduxMw = reduxHttpMiddlewareFactory();

export const getFinTransAtMonthRequest = reduxMw.register(
    http
        .get<MonthRequestParams>(apiUrl("fin/trans/at-month/:month/:currency"))
        .withFetch(customFetch)
        .resultFromJson<FinancialTransactionInfo[]>()
        .build()
);

export const getPlanningEventsAtMonthRequest = reduxMw.register(
    http
        .get<MonthRequestParams>(
            apiUrl("planning/planning-events/at-month/:month/:currency")
        )
        .withFetch(customFetch)
        .resultFromJson<PlanningEventInfo[]>()
        .build()
);

export interface MonthRequestParams {
    month: string;
    currency: string;
}
