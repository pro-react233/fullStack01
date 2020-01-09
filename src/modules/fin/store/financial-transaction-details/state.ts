import { FETCH_STATE_INITIAL } from "rd-redux-http";
import { getTransactionDetailsRequest, postTransactionRequest } from "../../api";
import { finTransactionForm } from "./form";

export interface FinancialTransactionDetailsDataState {
    data: typeof getTransactionDetailsRequest.types.reduxState;
    form: typeof finTransactionForm.types.state;
    saving: typeof postTransactionRequest.types.reduxState;
}

export interface FinancialTransactionDetailsState {
    finTransactions: { [id: string]: FinancialTransactionDetailsDataState };
}

export const defaultTransactionDetailsState: FinancialTransactionDetailsState = {
    finTransactions: {}
};

export const defaultFinTransactionDetailsDataState: FinancialTransactionDetailsDataState = {
    data: {
        fetchState: FETCH_STATE_INITIAL
    },
    saving: {
        fetchState: FETCH_STATE_INITIAL
    },
    form: finTransactionForm.state.empty()
};
