import { combineReducersPartial } from "rd-redux-utils";
import { Action } from "redux";
import { getPlanByIdRequest } from "../../api";
import {
    planDataActionGroup,
    scheduleActionGroup,
    addScheduleAction,
    removeScheduleAction,
    removeAllSchedulesAction
} from "./actions";
import { planForm, scheduleForm } from "./forms";
import {
    AllPlanDataState,
    defaultAllPlanDataState,
    defaultPlanDataState
} from "./state";
import { nextScheduleId } from "./schedule-id-generator";
const scheduleFormsReducer = scheduleActionGroup.hashedReducer(
    a => a.scheduleId,
    scheduleForm.reducer
);

const planDataReducer = combineReducersPartial(
    {
        data: getPlanByIdRequest.reducer,
        form: planForm.reducer,
        scheduleForms: (
            state: { [scheduleId: string]: typeof scheduleForm.types.state },
            action: Action
        ) => {
            if (getPlanByIdRequest.actions.isOk(action)) {
                return (action.result.schedules || []).reduce(
                    (result, schedule, index) => {
                        result[
                            schedule.id.toString()
                        ] = scheduleForm.state.withData({
                            id: schedule.id,
                            ordinal: index
                        } as any);
                        return result;
                    },
                    {}
                );
            }

            if (addScheduleAction.is(action)) {
                const schedule = state[action.addAfterScheduleId];
                const nextOrdinal = schedule ? schedule.fields.ordinal + 1 : 0;
                const newSchedule = scheduleForm.state.withData({
                    ...(action.scheduleData || {}),
                    id: nextScheduleId(),
                    ordinal: nextOrdinal
                } as any);

                return Object.keys(state).reduce(
                    (result, scheduleId) => {
                        const schedule = state[scheduleId];

                        if (schedule.fields.ordinal > nextOrdinal - 1) {
                            result[scheduleId] = {
                                ...schedule,
                                fields: {
                                    ...schedule.fields,
                                    ordinal: (schedule.fields.ordinal || 0) + 2
                                }
                            };
                        } else {
                            result[scheduleId] = schedule;
                        }

                        return result;
                    },
                    {
                        [newSchedule.fields.id]: newSchedule
                    }
                );
            }

            if (removeScheduleAction.is(action)) {
                return Object.keys(state)
                    .filter(k => k !== action.scheduleId)
                    .reduce((result, key) => {
                        result[key] = state[key];
                        return result;
                    }, {});
            }

            if (removeAllSchedulesAction.is(action)) {
                return {};
            }

            return scheduleFormsReducer(state, action);
        }
    },
    defaultPlanDataState
);

export const planDetailsReducer = combineReducersPartial<AllPlanDataState>(
    {
        plans: planDataActionGroup.hashedReducer(a => a.id, planDataReducer)
    },
    defaultAllPlanDataState
);
