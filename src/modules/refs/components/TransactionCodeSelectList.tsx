import { SelectList, SelectListProps } from "@controls";
import { AppState } from "@store";
import { FetchingState } from "rd-redux-http";
import { connect } from "react-redux";
import { TransactionCodeRef } from "../api";
import { sort } from "@utils";

export interface TransactionCodeSelectListProps {
    disabled?: boolean;
    value: number;
    onChange: (newValue: number) => void;
}

export const TransactionCodeSelectList = connect(
    (appState: AppState, ownProps: TransactionCodeSelectListProps): SelectListProps<TransactionCodeRef> => {
        return {
            items: sort(
                FetchingState.getDataOrDefault(appState.refs.transactionCodes, []),
                [i => i.isActive, "desc"],
                i => i.name
            ),
            children: c => c.name,
            includeEmptyItem: true,
            emptyItemValue: 0,
            getValue: c => c.code,
            getItemEnabled: c => c.isActive,
            ...ownProps
        };
    }
)(SelectList);
