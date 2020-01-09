import * as React from "react";
import { Route } from "react-router";
import {
    PlanningFinancialResultsPageUrl,
    PlanFactFinancialResultsPageUrl
} from "./urls";
import {
    PlanningFinancialResultsReport,
    PlanFactFinResultsReportPage
} from "./pages";

export const ReportingRoutes = [
    <Route
        key={PlanningFinancialResultsPageUrl.urlTemplate}
        exact
        path={PlanningFinancialResultsPageUrl.urlTemplate}
        component={PlanningFinancialResultsReport}
    />,
    <Route
        key={PlanFactFinancialResultsPageUrl.urlTemplate}
        exact
        path={PlanFactFinancialResultsPageUrl.urlTemplate}
        component={PlanFactFinResultsReportPage}
    />
];
