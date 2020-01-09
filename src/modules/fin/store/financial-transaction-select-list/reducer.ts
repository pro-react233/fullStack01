import { getTransactionListRequest } from "../../api";
import { Action } from "redux";
import { initFinTransactionSelectListAction } from "./actions";
import { FetchingState } from "rd-redux-http";

type State = typeof getTransactionListRequest.types.reduxState;

export function finTransactionSelectListReducer(state: State, action: Action): State {
    const newState = getTransactionListRequest.reducer(state, action);

    if (initFinTransactionSelectListAction.is(action)) {
        return {
            fetchState: FetchingState.INITIAL
        };
    }

    return newState;
}
