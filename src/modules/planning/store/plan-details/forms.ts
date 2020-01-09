import { PlanFields, ScheduleFormFields } from "modules/planning/api";
import { createForm, fields, reactBinding } from "rd-redux-forms";
import { specialFields } from "@utils";

export interface PlanFormMeta {
    id: string;
}

export const planForm = createForm<PlanFields, PlanFormMeta>("PLAN", {
    name: fields.string(true),
    isActive: fields.any()
});

export const planFormBindings = reactBinding()
    .default()
    .withForm(planForm);

export interface ScheduleFormMeta {
    id: string;
    scheduleId: string;
}

export const scheduleForm = createForm<ScheduleFormFields, ScheduleFormMeta>(
    "SCHEDULE",
    {
        id: fields.any(),
        costCenterId: fields.int(true),
        currency: fields.string(true),
        startDate: specialFields.momentDate(true),
        endDate: specialFields.momentDate(false),
        isActive: fields.any(),
        name: fields.string(true),
        scheduleRule: fields.string(true),
        scheduleSettings: fields.string(false),
        valueExpression: fields.string(true),
        attributes: fields.any(),
        ordinal: fields.int(true)
    }
);

export const scheduleFormBindings = reactBinding()
    .default()
    .withForm(scheduleForm);
