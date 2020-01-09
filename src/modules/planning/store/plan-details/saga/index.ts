import { all } from "redux-saga/effects";
import { loadPlanDetailsOnNavigating } from "./loadPlanDetailsOnNavigating";
import { resetNewPlanDataOnNavigating } from "./resetNewPlanDataOnNavigating";
import { savePlan } from "./savePlan";
import { validateScheduleFormOnValidatingPlanForms } from "./validateScheduleFormOnValidatingPlanForms";
import { linkCostCenterWithCurrency } from "./linkCostCenterWithCurrency";

export function* planDetailsSaga() {
    yield all([
        loadPlanDetailsOnNavigating(),
        resetNewPlanDataOnNavigating(),
        validateScheduleFormOnValidatingPlanForms(),
        savePlan(),
        linkCostCenterWithCurrency()
    ]);
}
