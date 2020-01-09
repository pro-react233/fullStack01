import { getCurrencyListRequest, getCostCenterListRequest, getTransactionCodeListRequest } from "../api";
import { FetchingState } from "rd-redux-http";

export interface RefState {
    currencies: typeof getCurrencyListRequest.types.reduxState;
    costCenters: typeof getCostCenterListRequest.types.reduxState;
    transactionCodes: typeof getTransactionCodeListRequest.types.reduxState;
}

export const defaultRefState: RefState = {
    currencies: { fetchState: FetchingState.INITIAL },
    costCenters: { fetchState: FetchingState.INITIAL },
    transactionCodes: { fetchState: FetchingState.INITIAL }
};
