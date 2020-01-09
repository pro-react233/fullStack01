import { FinancialTransactionListState, defaultFinancialTransactionListState } from "./state";
import { Action } from "redux";
import { getTransactionListRequest } from "../../api";

export function financialTransactionListReducer(
    state: FinancialTransactionListState = defaultFinancialTransactionListState,
    action: Action
): FinancialTransactionListState {
    if (getTransactionListRequest.actions.isMy(action)) {
        return {
            ...state,
            request: getTransactionListRequest.reducer(state.request, action)
        };
    }

    return state;
}
