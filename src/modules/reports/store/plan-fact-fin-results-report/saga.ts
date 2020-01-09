import { runRequestAsSaga } from "@store/utils";
import { LocationChangeAction, LOCATION_CHANGE } from "react-router-redux";
import { Action } from "redux";
import { takeEvery, all, select } from "redux-saga/effects";
import {
    planFactFinResultsReportRequest,
    getFinTransAtMonthRequest,
    getPlanningEventsAtMonthRequest
} from "../../api";
import { PlanFactFinancialResultsPageUrl } from "../../urls";
import { AppState } from "@store";
import { FetchingState } from "rd-redux-http";
import { PlanFactFinResultsReportState } from "./state";

const DEFAULT_REPORT_CURRENCY = "UAH";

export function* planFactFinResultsReportSaga() {
    yield takeEvery(
        (a: Action) =>
            a.type === LOCATION_CHANGE &&
            PlanFactFinancialResultsPageUrl.match(
                (a as LocationChangeAction).payload,
                true
            ).isMatched,
        function*(a: LocationChangeAction) {
            try {
                const urlMatch = PlanFactFinancialResultsPageUrl.match(
                    a.payload,
                    true
                );

                if (!urlMatch.isMatched) {
                    return;
                }
                const reportState: PlanFactFinResultsReportState = yield select(
                    (appState: AppState) => appState.reports.planFactFinResults
                );

                if (!FetchingState.isSuccess(reportState.report)) {
                    yield* runRequestAsSaga(planFactFinResultsReportRequest, {
                        currency: DEFAULT_REPORT_CURRENCY
                    });
                }

                if (urlMatch.params.month) {
                    yield all([
                        runRequestAsSaga(getFinTransAtMonthRequest, {
                            month: urlMatch.params.month,
                            currency: "UAH"
                        }),
                        runRequestAsSaga(getPlanningEventsAtMonthRequest, {
                            month: urlMatch.params.month,
                            currency: "UAH"
                        })
                    ]);
                }
            } catch (e) {
                console.error(e);
            }
        }
    );
}
