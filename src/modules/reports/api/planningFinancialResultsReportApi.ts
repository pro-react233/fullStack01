import { apiUrl, customFetch } from "@api/common";
import { http, reduxHttpMiddlewareFactory } from "rd-redux-http";
import { sort } from "@utils";

const reduxMw = reduxHttpMiddlewareFactory();

export interface CurrencyRef {
    code: string;
    currency: string;
}

export const planningFinancialResultsReportRequest = reduxMw.register(
    http
        .get<{ date: string; currency: string }>(
            apiUrl("/report/planning-financial-results/:date/:currency")
        )
        .withFetch(customFetch)
        .resultFromJson<PlanningFinancialResultsReport>()
        .build()
);

export interface PlanningFinancialResultsReport {
    planFactSplitDate: string | null;
    eventRecords: PlanningFinancialResultReportRecord[];
}
export interface PlanningFinancialResultReportRecord {
    id: number;
    ordinal: number;
    occurredAt: string;
    occurredAtMonth: string;
    scheduleId: number;
    scheduleName: string;
    currency: string;
    amount: number;
    slidingTotal: number;
    monthlyTotal: number;
    monthlyTotalSliding: number;
}

export interface MonthlyFinancialResultsRecord {
    month: string;
    monthlyTotal: number;
    monthlySlidingTotal: number;
    monthlyTotalIncome: number;
    monthlyTotalExpence: number;
    currency: string;

    events: PlanningFinancialResultReportRecord[];
}

export function buildMonthlyFinancialResultsReport(
    data: PlanningFinancialResultReportRecord[]
): MonthlyFinancialResultsRecord[] {
    const hash: {
        [month: string]: PlanningFinancialResultReportRecord[];
    } = data.reduce((result, record) => {
        const existing = result[record.occurredAtMonth] || [];

        result[record.occurredAtMonth] = [...existing, record];

        return result;
    }, {});

    return sort(
        Object.keys(hash).map<MonthlyFinancialResultsRecord>(month => ({
            events: sort(hash[month], e => e.scheduleName),
            month,
            monthlySlidingTotal: hash[month][0].monthlyTotalSliding,
            monthlyTotal: hash[month][0].monthlyTotal,
            monthlyTotalExpence: hash[month].reduce(
                (sum, e) => sum + (e.amount < 0 ? e.amount : 0),
                0
            ),
            monthlyTotalIncome: hash[month].reduce(
                (sum, e) => sum + (e.amount > 0 ? e.amount : 0),
                0
            ),
            currency: hash[month][0].currency
        })),
        [e => e.month, "asc"]
    );
}
