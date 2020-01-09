import { getPlanByIdRequest } from "@planning";
import { ScheduleFormFields } from "modules/planning/api";
import { defineActionGroup } from "rd-redux-utils";
import { planForm, scheduleForm } from "./forms";

export const planDataActionGroup = defineActionGroup<{ id: string }>(
    "PLAN DATA EDIT"
)
    .includeAction(getPlanByIdRequest.actions.isMy, a => ({ id: a.params.id }))
    .includeAction(planForm.actions.isMyAction, a => ({ id: a.meta.id }));

export const scheduleActionGroup = planDataActionGroup
    .defineActionGroup<{ scheduleId: string }>("SCHEDULES")
    .includeAction(scheduleForm.actions.isMyAction, a => ({
        id: a.meta.id,
        scheduleId: a.meta.scheduleId
    }));

export const addScheduleAction = planDataActionGroup.defineAction<{
    addAfterScheduleId?: string;
    scheduleData?: Partial<ScheduleFormFields>;
}>("ADD SCHEDULE");

export const removeScheduleAction = planDataActionGroup.defineAction<{
    scheduleId: string;
}>("REMOVE SCHEDULE");

export const removeAllSchedulesAction = planDataActionGroup.defineAction<{}>(
    "REMOVE ALL SCHEDULES"
);
