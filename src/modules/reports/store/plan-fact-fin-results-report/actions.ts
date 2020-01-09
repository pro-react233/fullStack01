import { defineActionGroup } from "rd-redux-utils";
import {
    getFinTransAtMonthRequest,
    getPlanningEventsAtMonthRequest
} from "../../api";

export const planFactReportsActionGroup = defineActionGroup<{ month: string }>(
    "PLAN FACT REPORT"
)
    .includeAction(getFinTransAtMonthRequest.actions.isMy, a => ({
        month: a.params.month
    }))
    .includeAction(getPlanningEventsAtMonthRequest.actions.isMy, a => ({
        month: a.params.month
    }));
