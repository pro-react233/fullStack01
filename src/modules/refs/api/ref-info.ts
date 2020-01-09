import { apiUrl, customFetch } from "@api/common";
import { http, reduxHttpMiddlewareFactory } from "rd-redux-http";

const reduxMw = reduxHttpMiddlewareFactory();

export interface CurrencyRef {
    code: string;
    currency: string;
}

export const getCurrencyListRequest = reduxMw.register(
    http
        .get(apiUrl("/ref/lists/currencies"))
        .withFetch(customFetch)
        .resultFromJson<CurrencyRef[]>()
        .build()
);

export interface CostCenterRef {
    id: number;
    name: string;
    isActive: boolean;
    currency: string;
}

export const getCostCenterListRequest = reduxMw.register(
    http
        .get(apiUrl("/ref/lists/cost-centers"))
        .withFetch(customFetch)
        .resultFromJson<CostCenterRef[]>()
        .build()
);

export interface TransactionCodeRef {
    code: number;
    name: string;
    description: string | null;
    isActive: boolean;
}

export const getTransactionCodeListRequest = reduxMw.register(
    http
        .get(apiUrl("/ref/lists/transaction-codes"))
        .withFetch(customFetch)
        .resultFromJson<TransactionCodeRef[]>()
        .build()
);
