import { SelectList, SelectListProps } from "@controls";
import { CostCenterRef } from "@ref";
import { AppState } from "@store";
import { createObjectComparer, sort } from "@utils";
import { FetchingState } from "rd-redux-http";
import { connect } from "react-redux";

export interface CostCenterSelectListProps {
    disabled?: boolean;
    value: number;
    onChange: (newValue: number) => void;
}

export const CostCenterSelectList = connect(
    (
        appState: AppState,
        ownProps: CostCenterSelectListProps
    ): Partial<SelectListProps<CostCenterRef>> => {
        return {
            items: sort(
                FetchingState.getDataOrDefault(appState.refs.costCenters, []),
                [i => i.isActive, "desc"],
                i => i.name
            ),
            includeEmptyItem: true,
            emptyItemValue: 0,
            value: ownProps.value,
            disabled: ownProps.disabled
        };
    },
    (
        _,
        ownProps: CostCenterSelectListProps
    ): Partial<SelectListProps<CostCenterRef>> => ({
        children: c => c.name,
        getValue: c => c.id,
        getItemEnabled: c => c.isActive,
        onChange: ownProps.onChange
    }),
    undefined,
    {
        areStatePropsEqual: createObjectComparer({
            compareReactChildren: true,
            considerFunctionsEqual: true,
            comparerName: "CostCenterSelectList"
        }),
        getDisplayName: () => "CostCenterSelectList"
    }
)(SelectList);
