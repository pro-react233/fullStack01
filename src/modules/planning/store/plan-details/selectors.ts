import { AppState } from "@store";
import { FetchingState } from "rd-redux-http";
import { scheduleForm } from "./forms";
import { sort } from "@utils";

export function scheduleFormSelector(
    appState: AppState,
    planId: string,
    scheduleId: string
): typeof scheduleForm.types.selectorResult {
    const planState = appState.planning.planDetails.plans[planId];
    if (!planState) {
        return scheduleForm.selector(scheduleForm.state.empty());
    }

    const scheduleState = planState.scheduleForms[scheduleId] || scheduleForm.state.empty();

    const planData = FetchingState.getDataOrDefault(planState.data, undefined);
    const schedule = planData ? planData.schedules.find(s => s.id.toString() === scheduleId) : undefined;

    return scheduleForm.selector(scheduleState, schedule);
}

export function scheduleIdSelector(appState: AppState, planId: string): string[] {
    const planState = appState.planning.planDetails.plans[planId];
    if (!planState) {
        return [];
    }

    return sort(
        Object.keys(planState.scheduleForms).map(id => ({
            id,
            schedule: planState.scheduleForms[id]
        })),
        a => a.schedule.fields.ordinal
    ).map(a => a.id);
}
