import { combineReducersPartial } from "rd-redux-utils";
import { RefState, defaultRefState } from "./state";
import { getCurrencyListRequest, getCostCenterListRequest, getTransactionCodeListRequest } from "../api";

export const refsReducer = combineReducersPartial<RefState>(
    {
        currencies: getCurrencyListRequest.reducer,
        costCenters: getCostCenterListRequest.reducer,
        transactionCodes: getTransactionCodeListRequest.reducer
    },
    defaultRefState
);
