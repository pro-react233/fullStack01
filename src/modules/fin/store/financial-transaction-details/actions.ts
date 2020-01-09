import { defineAction } from "rd-redux-utils";
import { FinancialTransactionInfo } from "modules/fin/api";

export const copyTransactionAction = defineAction<{
    copyFromTransaction: FinancialTransactionInfo;
}>("FIN TRANSACTION COPY TRANSACTIONS");
