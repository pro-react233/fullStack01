import * as React from "react";
import { Route } from "react-router";
import { FinTransactionListUrl, FinTransactionDetailsUrl } from "./urls";
import { FinancialTransactionList, FinancialTransactionDetails } from "./pages";

export const FinancialRoutes = [
    <Route
        key={FinTransactionListUrl.urlTemplate}
        exact
        path={FinTransactionListUrl.urlTemplate}
        component={FinancialTransactionList}
    />,
    <Route
        key={FinTransactionDetailsUrl.urlTemplate}
        exact
        path={FinTransactionDetailsUrl.urlTemplate}
        component={FinancialTransactionDetails}
    />
];
