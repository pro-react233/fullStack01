import { FETCH_STATE_INITIAL } from "rd-redux-http";
import { getTransactionListRequest } from "../../api";

export interface FinancialTransactionListState {
    request: typeof getTransactionListRequest.types.reduxState;
}
export const defaultFinancialTransactionListState: FinancialTransactionListState = {
    request: {
        fetchState: FETCH_STATE_INITIAL
    }
};
