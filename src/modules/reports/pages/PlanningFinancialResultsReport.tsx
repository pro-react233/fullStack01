import { LayoutComponent } from "@layouts";
import { AppState } from "@store";
import { Spin } from "antd";
import { FetchingState } from "rd-redux-http";
import * as React from "react";
import { connect } from "react-redux";
import {
    buildMonthlyFinancialResultsReport,
    MonthlyFinancialResultsRecord
} from "../api";
import {
    PlanningFinancialResultsChart,
    PlanningFinancialResultsDetails
} from "../components";
import "./PlanningFinancialResultsReport.less";

interface PlanningFinancialResultsReportComponentProps {
    isLoading: boolean;
    data: MonthlyFinancialResultsRecord[];
}

function PlanningFinancialResultsReportComponent({
    isLoading,
    data
}: PlanningFinancialResultsReportComponentProps) {
    return (
        <LayoutComponent activeTab="reports.planning-results">
            {isLoading && <Spin />}
            {!isLoading && (
                <>
                    <div>
                        <PlanningFinancialResultsChart data={data} />
                    </div>
                    <div>
                        <PlanningFinancialResultsDetails data={data} />
                    </div>
                </>
            )}
        </LayoutComponent>
    );
}

export const PlanningFinancialResultsReport = connect(
    (appState: AppState): PlanningFinancialResultsReportComponentProps => ({
        isLoading: FetchingState.isInitialOrFetching(
            appState.reports.planningFinancialResults
        ),
        data: buildMonthlyFinancialResultsReport(
            FetchingState.getDataOrDefault(
                appState.reports.planningFinancialResults,
                {
                    eventRecords: [],
                    planFactSplitDate: null
                }
            ).eventRecords
        )
    })
)(PlanningFinancialResultsReportComponent);
