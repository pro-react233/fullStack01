import { CustomAttributeValue } from "@custom-attrs";

export interface PlanFields {
    name: string;
    isActive: boolean;
}
export interface PlanInfo extends PlanFields {
    id: number;
}

export interface PlanData {
    plan: PlanInfo;
    schedules: ScheduleDetails[];
}

export interface ScheduleDetails {
    id: number;
    name: string;
    currency: string;
    costCenterId: number;
    startDate: string;
    endDate?: string;
    isActive: boolean;
    scheduleRule: string;
    scheduleSettings: string;
    valueExpression: string;
    attributes: ScheduleAttribute[];
}

export interface ScheduleFormFields extends ScheduleDetails {
    ordinal: number;
}

export interface ScheduleAttribute extends CustomAttributeValue {
    id: string;
    scheduleId: string;
}

export interface PlanningEvent {
    id: number;
    ordinal: number;
    occurredAt: string;
    amount: number;
    currency: string;
    costCenterId: string;
    scheduleId: string;
    isChangedManually: boolean;
    createdAt: string;
}

export interface PlanningEventInfo extends PlanningEvent {
    planId: number;
    costCenterName: string;
    scheduleName: string;
    convertedAmount: number;
    convertedToCurrency: string;
}
