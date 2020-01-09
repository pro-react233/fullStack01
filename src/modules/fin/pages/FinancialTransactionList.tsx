import { GenericList } from "@components";
import { DataGridCol } from "@controls";
import * as moment from "moment";
import * as React from "react";
import { Link } from "react-router-dom";
import { FinancialTransactionInfo } from "../api";
import { FinTransactionDetailsUrl, FinTransactionListUrl } from "../urls";
import { Icon } from "antd";
import { formatAmount } from "@utils";

const NegativeRowClass = "FinTransactionList__expense-row";

export function FinancialTransactionList(): React.ReactElement<{}> {
    return (
        <GenericList<FinancialTransactionInfo>
            newItemUrl={FinTransactionDetailsUrl.format({
                id: "new"
            })}
            rowKey={i => i.id.toString()}
            rowClassName={i => (i.amount < 0 ? NegativeRowClass : "")}
            title="Financial transaction list"
            activeTab="fin"
            pageUrl={FinTransactionListUrl}
            stateAccessor={state => state.fin.financialTransactionList.request}
        >
            <DataGridCol<FinancialTransactionInfo> header="ID" sortsBy="id">
                {item => (
                    <Link
                        to={FinTransactionDetailsUrl.format({
                            id: `${item.id}`
                        })}
                    >
                        {item.id}
                    </Link>
                )}
            </DataGridCol>
            <DataGridCol<FinancialTransactionInfo>
                header="Occurred At"
                sortsBy="occurredAt"
            >
                {item => moment(item.occurredAt).format("YYYY MMM DD HH:mm:SS")}
            </DataGridCol>
            <DataGridCol<FinancialTransactionInfo>
                header="Amount"
                sortsBy="amount"
                numeric
            >
                {item => (
                    <span>
                        {formatAmount(item.amount)} {item.currency}
                    </span>
                )}
            </DataGridCol>
            <DataGridCol<FinancialTransactionInfo>
                header="Code"
                sortsBy="transactionCodeName"
            >
                {item => item.transactionCodeName}
            </DataGridCol>
            <DataGridCol<FinancialTransactionInfo>
                header="Cost Center"
                sortsBy="costCenterName"
            >
                {item => item.costCenterName}
            </DataGridCol>
            <DataGridCol<FinancialTransactionInfo> header="Actions">
                {item => (
                    <Link
                        to={FinTransactionDetailsUrl.format(
                            { id: "new" },
                            { copyFromTransaction: item.id.toString() }
                        )}
                        className="ant-btn ant-btn-primary"
                    >
                        <Icon type="copy" />
                        Copy
                    </Link>
                )}
            </DataGridCol>
        </GenericList>
    );
}
