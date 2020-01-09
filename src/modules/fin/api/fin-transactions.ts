import { apiUrl, customFetch, PageResult, ApiValidationError, ListRequest, PropsOf } from "@api/common";
import { http, reduxHttpMiddlewareFactory } from "rd-redux-http";
import { FinancialTransactionInfo, PostFinancialTransactionRequest } from "./api";

const reduxMw = reduxHttpMiddlewareFactory();

export type FinTransactionSortableProps = PropsOf<
    FinancialTransactionInfo,
    "amount" | "transactionCodeName" | "costCenterName" | "currency" | "occurredAt" | "id"
>;

export type FinTransactionListRequest = ListRequest<FinTransactionSortableProps>;

export const getTransactionListRequest = reduxMw.register(
    http
        .get<FinTransactionListRequest>(apiUrl("/fin/trans"), true)
        .withFetch(customFetch)
        .resultFromJson<PageResult<FinancialTransactionInfo>>()
        .build()
);

export const getTransactionDetailsRequest = reduxMw.register(
    http
        .get<{ id: string }>(apiUrl("/fin/trans/:id"), true)
        .withFetch(customFetch)
        .resultFromJson<FinancialTransactionInfo>()
        .build()
);

export const postTransactionRequest = reduxMw.register(
    http
        .post<{ id: string }>(apiUrl("/fin/trans"))
        .withFetch(customFetch)
        .jsonBody<PostFinancialTransactionRequest>()
        .resultFromJson<FinancialTransactionInfo, ApiValidationError[]>()
        .build()
);
