import { createPath } from "rd-url-utils";
import { FinTransactionListRequest } from "./api";

export const FIN_MODULE_PREFIX = "/fin";

export const FinTransactionListUrl = createPath<{}, FinTransactionListRequest>(
    FIN_MODULE_PREFIX + "/transactions"
);
export const FinTransactionDetailsUrl = createPath<
    { id: string },
    {
        copyFromTransaction?: string;
    }
>(FIN_MODULE_PREFIX + "/transactions/:id");
