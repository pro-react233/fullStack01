import { getPlanningEventsRequest } from "modules/planning/api";

export interface PlanningEventsState {
    [planId: number]: typeof getPlanningEventsRequest.types.reduxState;
}

export const defaultPlanningEventsState: PlanningEventsState = {};
