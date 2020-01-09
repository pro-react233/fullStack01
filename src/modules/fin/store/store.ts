import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import {
    financialTransactionListReducer,
    FinancialTransactionListState,
    financialTransactionListSaga
} from "./financial-transactions-list";
import {
    FinancialTransactionDetailsState,
    financialTransactionDetailsReducer,
    financialTransactionDetailsSaga
} from "./financial-transaction-details";
import { getTransactionListRequest } from "../api";
import { finTransactionSelectListReducer } from "./financial-transaction-select-list";

export interface FinModuleState {
    financialTransactionList: FinancialTransactionListState;
    financialTransactionDetails: FinancialTransactionDetailsState;
    financialTransactionSelectList: typeof getTransactionListRequest.types.reduxState;
}

export const financialModuleReducer = combineReducers<FinModuleState>({
    financialTransactionList: financialTransactionListReducer,
    financialTransactionDetails: financialTransactionDetailsReducer,
    financialTransactionSelectList: finTransactionSelectListReducer
});

export function* financialModuleSaga() {
    yield all([financialTransactionListSaga(), financialTransactionDetailsSaga()]);
}
