export interface FinancialTransactionFields {
    occurredAt: string;
    amount: number;
    currency: string;
    costCenterId: number;
    code: number;
    description?: string;
    externalTransactionId?: string;
    correlatedTransactionId?: number;
}

export interface FinancialTransaction extends FinancialTransactionFields {
    id: number;
    createdAt: string;
    createdBy: string;
}

export interface FinancialTransactionInfo extends FinancialTransaction {
    costCenterName: string;
    transactionCodeName: string;
    canEdit: boolean;
    convertedInCurrency: string;
    convertedAmount: number;
    correlatedTransaction: FinancialTransaction | null;
    transactionsCorrelatedToThisTransaction: FinancialTransaction[];
}

export interface FinancialAttribte {
    attribute: string;
    ref: number;
}

export interface PostFinancialTransactionRequest {
    transaction: FinancialTransactionFields & { id?: number };
    attributes: FinancialAttribte[];
}
