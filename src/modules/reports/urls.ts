import { createPath } from "rd-url-utils";

export const REPORTS_MODULE_PREFIX = "/fin";

export const PlanningFinancialResultsPageUrl = createPath<{}>("/");
export const PlanFactFinancialResultsPageUrl = createPath<{ month?: string }>(
    "/reports/fin/plan-fact-fin-results/:month?"
);
