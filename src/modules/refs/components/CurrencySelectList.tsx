import { SelectList, SelectListProps } from "@controls";
import { CurrencyRef } from "@ref";
import { AppState } from "@store";
import { createObjectComparer, sort } from "@utils";
import { FetchingState } from "rd-redux-http";
import { connect } from "react-redux";

export interface CurrencySelectListProps {
    disabled?: boolean;
    value: string;
    onChange: (newValue: string) => void;
}

export const CurrencySelectList = connect(
    (appState: AppState, ownProps: CurrencySelectListProps): Partial<SelectListProps<CurrencyRef>> => {
        return {
            items: sort(FetchingState.getDataOrDefault(appState.refs.currencies, []), i => i.currency),
            includeEmptyItem: true,
            disabled: ownProps.disabled,
            value: ownProps.value
        };
    },
    (_, ownProps: CurrencySelectListProps): Partial<SelectListProps<CurrencyRef>> => ({
        getValue: c => c.code,
        children: c => c.currency,
        onChange: ownProps.onChange
    }),
    undefined,
    {
        areStatePropsEqual: createObjectComparer({
            considerFunctionsEqual: true,
            comparerName: "CurrencySelectList.stateProps"
        }),
        areOwnPropsEqual: createObjectComparer({
            comparerName: "CurrencySelectList.ownProps"
        }),
        getDisplayName: () => "CurrencySelectList"
    }
)(SelectList);
// shouldUpdate(arePropsEqual)
