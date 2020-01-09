import { planningEventActionGroup } from "./actions";
import { getPlanningEventsRequest } from "../../api";
import { defaultPlanningEventsState } from "./state";
import { Action } from "redux";

const planningEventReducerHashed = planningEventActionGroup.hashedReducer(
    p => p.planId.toString(),
    getPlanningEventsRequest.reducer
);

export function planningEventReducer(
    state = defaultPlanningEventsState,
    action: Action
) {
    return planningEventReducerHashed(state, action);
}
