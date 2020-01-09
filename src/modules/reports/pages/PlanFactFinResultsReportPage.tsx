import { LayoutComponent } from "@layouts";
import { AppState } from "@store";
import { Spin } from "antd";
import { FetchingState } from "rd-redux-http";
import * as React from "react";
import { connect } from "react-redux";
import { PlanFactFinResultsReportRecord } from "../api";
import { MonthlyPlanFactGraph, MonthlyPlanFactTotal } from "../components";
import { PlanFactFinancialResultsPageUrl } from "../urls";
import "./PlanningFinancialResultsReport.less";
import { Dispatch } from "redux";
import { push } from "react-router-redux";
import { PlanningEventInfo } from "@planning";
import { FinancialTransactionInfo } from "@fin";

interface PlanFactFinResultsReportPageComponentProps {
    isLoading: boolean;
    data: PlanFactFinResultsReportRecord[];
    selectedMonth?: string;
    onMonthSelected: (month: string) => void;

    isDetailsLoading: boolean;
    events: PlanningEventInfo[];
    transactions: FinancialTransactionInfo[];
}

function PlanFactFinResultsReportPageComponent({
    isLoading,
    isDetailsLoading,

    data,
    events,
    transactions,
    selectedMonth,
    onMonthSelected
}: PlanFactFinResultsReportPageComponentProps) {
    return (
        <LayoutComponent activeTab="reports.plan-fact-fin-results">
            {isLoading && <Spin />}
            {!isLoading && (
                <>
                    <MonthlyPlanFactGraph
                        data={data}
                        onMonthSelected={onMonthSelected}
                    />
                </>
            )}
            <section>
                {isDetailsLoading && <Spin />}
                {!isDetailsLoading && (
                    <MonthlyPlanFactTotal
                        events={events}
                        transaction={transactions}
                        month={selectedMonth}
                    />
                )}
            </section>
        </LayoutComponent>
    );
}

export const PlanFactFinResultsReportPage = connect(
    (
        appState: AppState
    ): Partial<PlanFactFinResultsReportPageComponentProps> => {
        const urlMatch = PlanFactFinancialResultsPageUrl.match(location, true);
        const selectedMonth =
            urlMatch.isMatched && urlMatch.params.month
                ? urlMatch.params.month
                : undefined;

        const monthlyInfo =
            appState.reports.planFactFinResults.monthly[selectedMonth || ""];

        return {
            isLoading: false,
            data: FetchingState.getDataOrDefault(
                appState.reports.planFactFinResults.report,
                []
            ),
            selectedMonth,
            isDetailsLoading:
                !monthlyInfo ||
                FetchingState.isInitialOrFetching(monthlyInfo.events) ||
                FetchingState.isInitialOrFetching(monthlyInfo.transactions),
            events: monthlyInfo
                ? FetchingState.getDataOrDefault(monthlyInfo.events, [])
                : [],
            transactions: monthlyInfo
                ? FetchingState.getDataOrDefault(monthlyInfo.transactions, [])
                : []
        };
    },
    (
        dispatch: Dispatch
    ): Partial<PlanFactFinResultsReportPageComponentProps> => ({
        onMonthSelected: (month: string) =>
            dispatch(push(PlanFactFinancialResultsPageUrl.format({ month })))
    })
)(PlanFactFinResultsReportPageComponent);
