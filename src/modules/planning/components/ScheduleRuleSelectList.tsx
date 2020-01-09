import { SelectList, SelectListProps } from "@controls";
import { AppState } from "@store";
import { createObjectComparer, sort } from "@utils";
import { connect } from "react-redux";

export interface ScheduleRuleRef {
    rule: string;
    title: string;
}

const scheduleRules: ScheduleRuleRef[] = [
    {
        rule: "each-days-of-month",
        title: "At certain days of month"
    },
    {
        rule: "each-days-of-week",
        title: "At certain days of week"
    },
    {
        rule: "each-num-of-days",
        title: "Each number of days"
    },
    {
        rule: "static-dates",
        title: "At specified dates"
    }
];

export interface ScheduleRuleSelectListProps {
    disabled?: boolean;
    value: string;
    onChange: (newValue: string) => void;
}

export const ScheduleRuleSelectList = connect(
    (_appState: AppState, ownProps: ScheduleRuleSelectListProps): SelectListProps<ScheduleRuleRef> => {
        return {
            items: sort(scheduleRules, i => i.title),
            children: c => c.title,
            includeEmptyItem: true,
            getValue: c => c.rule,
            ...ownProps
        };
    },
    undefined,
    undefined,
    {
        areStatePropsEqual: createObjectComparer({
            comparerName: "ScheduleRuleSelectList.stateProps"
        })
    }
)(SelectList);
