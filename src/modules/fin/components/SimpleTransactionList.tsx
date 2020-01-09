import { FinancialTransaction } from "@fin";
import { Table } from "antd";
import { History } from "history";
import * as moment from "moment";
import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { CostCenterRef, TransactionCodeRef } from "@ref";
import { compose } from "recompose";
import { connect } from "react-redux";
import { AppState } from "@store";
import { FetchingState } from "rd-redux-http";
import { Link } from "react-router-dom";
import { FinTransactionDetailsUrl } from "../urls";

export interface SimpleTransactionListComponentProps {
    transactions: FinancialTransaction[];
    costCenters: CostCenterRef[];
    transactionCodes: TransactionCodeRef[];
    history: History;
}
const NegativeRowClass = "FinTransactionList__expense-row";

function SimpleTransactionListComponent({
    transactions,
    costCenters,
    transactionCodes,
    history
}: SimpleTransactionListComponentProps) {
    return (
        <Table
            dataSource={transactions}
            rowKey="id"
            size="small"
            bordered
            pagination={false}
            rowClassName={i => (i.amount < 0 ? NegativeRowClass : "")}
        >
            <Table.Column
                dataIndex="id"
                title="ID"
                sorter={true}
                render={(_, item: FinancialTransaction) => (
                    <Link
                        to={FinTransactionDetailsUrl.format({
                            id: item.id.toString()
                        })}
                    >
                        {item.id}
                    </Link>
                )}
            />
            <Table.Column
                dataIndex="occurredAt"
                title="Occurred At"
                sorter={true}
                render={(_, item: FinancialTransaction) =>
                    moment(item.occurredAt).format("YYYY MMM DD HH:mm:SS")
                }
            />
            <Table.Column
                dataIndex="amount"
                title="Amount"
                sorter={true}
                render={(_, item: FinancialTransaction) =>
                    `${item.amount} ${item.currency}`
                }
            />
            <Table.Column
                dataIndex="transactionCodeName"
                title="Transaction Code"
                render={(_, item: FinancialTransaction) =>
                    transactionCodes
                        .filter(c => c.code === item.code)
                        .map(c => c.name)[0]
                }
            />
            <Table.Column
                dataIndex="costCenterName"
                title="Cost Center"
                render={(_, item: FinancialTransaction) =>
                    costCenters
                        .filter(c => c.id === item.costCenterId)
                        .map(c => c.name)[0]
                }
            />
        </Table>
    );
}

export interface SimpleTransactionListProps {
    transactions: FinancialTransaction[];
}

export const SimpleTransactionList = compose<
    SimpleTransactionListComponentProps,
    SimpleTransactionListProps
>(
    withRouter,
    connect(
        (
            appState: AppState,
            ownProps: SimpleTransactionListProps & RouteComponentProps
        ): SimpleTransactionListComponentProps => ({
            costCenters: FetchingState.getDataOrDefault(
                appState.refs.costCenters,
                []
            ),
            transactionCodes: FetchingState.getDataOrDefault(
                appState.refs.transactionCodes,
                []
            ),
            transactions: ownProps.transactions,
            history: ownProps.history
        })
    )
)(SimpleTransactionListComponent);
