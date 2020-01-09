import { getPlanByIdRequest } from "modules/planning/api";
import { FetchingState } from "rd-redux-http";
import { planForm, scheduleForm } from "./forms";

export interface PlanDataState {
    data: typeof getPlanByIdRequest.types.reduxState;
    form: typeof planForm.types.state;

    scheduleForms: {
        [scheduleId: string]: typeof scheduleForm.types.state;
    };
}

export const defaultPlanDataState: PlanDataState = {
    data: {
        fetchState: FetchingState.INITIAL
    },
    form: planForm.state.empty(),
    scheduleForms: {}
};

export interface AllPlanDataState {
    plans: { [id: string]: PlanDataState };
}

export const defaultAllPlanDataState: AllPlanDataState = {
    plans: {}
};
