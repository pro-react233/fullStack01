import { defineActionGroup } from "rd-redux-utils";
import { getPlanningEventsRequest } from "../../api";

export const planningEventActionGroup = defineActionGroup<{ planId: number }>(
    "PLANNING EVENTS"
).includeAction(getPlanningEventsRequest.actions.isMy, a => ({
    planId: a.params.planId
}));
