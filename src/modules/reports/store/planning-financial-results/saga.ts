import { runRequestAsSaga } from "@store/utils";
import { LocationChangeAction, LOCATION_CHANGE } from "react-router-redux";
import { Action } from "redux";
import { takeEvery } from "redux-saga/effects";
import { planningFinancialResultsReportRequest } from "../../api";
import { PlanningFinancialResultsPageUrl } from "../../urls";
import * as moment from "moment";

export function* planningFinancialResultsSaga() {
    yield takeEvery(
        (a: Action) =>
            a.type === LOCATION_CHANGE &&
            PlanningFinancialResultsPageUrl.match(
                (a as LocationChangeAction).payload,
                true
            ).isMatched,
        function*() {
            try {
                yield* runRequestAsSaga(planningFinancialResultsReportRequest, {
                    date: moment().format("YYYY-MM-DD"),
                    currency: "USD"
                });
            } catch (e) {
                console.error(e);
            }
        }
    );
}
