import { Field } from "@controls";
import { CustomAttributeEditor } from "@custom-attrs";
import { DetailsLayout } from "@layouts";
import {
    CostCenterSelectList,
    CurrencySelectList,
    TransactionCodeSelectList
} from "@ref";
import { AppState } from "@store";
import { createObjectComparer } from "@utils";
import { Button, Col, Form, Input, Row, Tabs, DatePicker } from "antd";
import { FetchingState } from "rd-redux-http";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { compose, setDisplayName } from "recompose";
import { Dispatch } from "redux";
import { FinancialTransaction } from "../api";
import { SimpleTransactionList } from "../components";
import { finTransactionForm, finTransactionFormBindings } from "../store";
import { FinTransactionListUrl } from "../urls";

export interface FinancialTransactionDetailsPageComponentProps {
    isLoading: boolean;
    isSaving: boolean;
    canEdit: boolean;
    transactionId: string;
    isNew: boolean;
    form: typeof finTransactionForm.types.selectorResult;
    formEvents: typeof finTransactionForm.types.eventBindings;
    correlatedTransaction: FinancialTransaction | null;
    transactionCorrelatedToThisTransaction: FinancialTransaction[];
}

function FinancialTransactionDetailsPageComponent({
    isLoading,
    isNew,
    isSaving,
    canEdit,
    transactionId,
    form,
    formEvents,
    correlatedTransaction,
    transactionCorrelatedToThisTransaction
}: FinancialTransactionDetailsPageComponentProps) {
    return (
        <DetailsLayout
            isLoading={isLoading}
            isSaving={isSaving}
            activeTab="fin"
        >
            <h2>
                {isNew
                    ? "New Financial Transaction"
                    : `Financial Transaction #${transactionId}`}
            </h2>
            <Form {...formEvents.form} layout="vertical">
                <Row gutter={16}>
                    <Col xs={12}>
                        <Row gutter={16}>
                            <Col xs={12}>
                                <Field
                                    label="Amount"
                                    field={form.fields.amount}
                                >
                                    <Input
                                        value={form.fields.amount.value}
                                        {...formEvents.fields.amount}
                                        disabled={!canEdit}
                                        type="text"
                                    />
                                </Field>
                            </Col>
                            <Col xs={12}>
                                <Field
                                    label="Currency"
                                    field={form.fields.currency}
                                >
                                    <CurrencySelectList
                                        value={form.fields.currency.value || ""}
                                        {...formEvents.fields.currency}
                                        disabled={!canEdit}
                                    />
                                </Field>
                            </Col>
                            <Col xs={12}>
                                <Field
                                    label="Transaction Code"
                                    field={form.fields.code}
                                >
                                    <TransactionCodeSelectList
                                        value={form.fields.code.value || 0}
                                        {...formEvents.fields.code}
                                        disabled={!canEdit}
                                    />
                                </Field>
                            </Col>
                            <Col xs={12}>
                                <Field
                                    label="Occurred At"
                                    field={form.fields.occurredAt}
                                >
                                    <DatePicker
                                        value={
                                            form.fields.occurredAt.value || ""
                                        }
                                        onChange={
                                            formEvents.fields.occurredAt
                                                .onChange
                                        }
                                        showTime
                                        disabled={!canEdit}
                                    />
                                </Field>
                            </Col>
                            <Col xs={24}>
                                <Field
                                    label="Cost center"
                                    field={form.fields.costCenterId}
                                >
                                    <CostCenterSelectList
                                        value={
                                            form.fields.costCenterId.value || 0
                                        }
                                        {...formEvents.fields.costCenterId}
                                        disabled={!canEdit}
                                    />
                                </Field>
                            </Col>
                            <Col xs={24}>
                                <Field
                                    label="Description"
                                    field={form.fields.description}
                                >
                                    <Input.TextArea
                                        value={
                                            form.fields.description.value || ""
                                        }
                                        {...formEvents.fields.description}
                                        disabled={!canEdit}
                                    />
                                </Field>
                            </Col>
                            <Col xs={12}>
                                <Field
                                    label="Related Transaction ID"
                                    field={form.fields.correlatedTransactionId}
                                >
                                    <Input
                                        value={
                                            form.fields.correlatedTransactionId
                                                .value || ""
                                        }
                                        {...formEvents.fields
                                            .correlatedTransactionId}
                                        disabled={!canEdit}
                                        type="text"
                                    />
                                </Field>
                            </Col>
                            <Col xs={12}>
                                <Field
                                    label="External Transaction Ref"
                                    field={form.fields.externalTransactionId}
                                >
                                    <Input
                                        value={
                                            form.fields.externalTransactionId
                                                .value || ""
                                        }
                                        {...formEvents.fields
                                            .externalTransactionId}
                                        disabled={!canEdit}
                                        type="text"
                                    />
                                </Field>
                            </Col>
                            <Col span={24} className="Form__button-container">
                                <Button
                                    type="primary"
                                    disabled={!canEdit}
                                    htmlType="submit"
                                >
                                    Save
                                </Button>
                                <Link
                                    to={FinTransactionListUrl.format({})}
                                    className="ant-btn ant-btn-dashed"
                                >
                                    Cancel
                                </Link>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <CustomAttributeEditor
                            value={form.fields.attributes.value || []}
                            {...formEvents.fields.attributes}
                            disabled={!canEdit}
                        />
                    </Col>
                    <Col xs={24}>
                        <Tabs>
                            {correlatedTransaction && (
                                <Tabs.TabPane
                                    tab="Correlated transactions"
                                    key="t1"
                                >
                                    <SimpleTransactionList
                                        transactions={[correlatedTransaction]}
                                    />
                                </Tabs.TabPane>
                            )}
                            {transactionCorrelatedToThisTransaction &&
                                transactionCorrelatedToThisTransaction.length && (
                                    <Tabs.TabPane
                                        tab="Transaction correlated with current"
                                        key="t2"
                                    >
                                        <SimpleTransactionList
                                            transactions={
                                                transactionCorrelatedToThisTransaction
                                            }
                                        />
                                    </Tabs.TabPane>
                                )}
                        </Tabs>
                    </Col>
                </Row>
            </Form>
        </DetailsLayout>
    );
}

export const FinancialTransactionDetails = compose<
    FinancialTransactionDetailsPageComponentProps,
    RouteComponentProps<{ id: string }>
>(
    connect(
        (
            appState: AppState,
            ownProps: RouteComponentProps<{ id: string }>
        ): Partial<FinancialTransactionDetailsPageComponentProps> => {
            const state = appState.fin.financialTransactionDetails;
            const refState = appState.refs;

            const transactionState =
                state.finTransactions[ownProps.match.params.id];
            const isNewTransaction = ownProps.match.params.id === "new";

            const form = finTransactionForm.selector(
                transactionState
                    ? transactionState.form
                    : finTransactionForm.state.withData({
                          amount: 0,
                          code: 0,
                          costCenterId: 0,
                          currency: "",
                          occurredAt: "",
                          attributes: []
                      }),
                transactionState
                    ? FetchingState.getDataOrDefault(
                          transactionState.data,
                          undefined
                      )
                    : undefined
            );

            const isSaving =
                !!transactionState &&
                FetchingState.isFetching(transactionState.saving);

            return {
                isLoading:
                    (!transactionState && !isNewTransaction) ||
                    [
                        FetchingState.FETCHING,
                        FetchingState.INITIAL as any
                    ].indexOf(
                        FetchingState.compose([
                            isNewTransaction
                                ? FetchingState.SUCCESS
                                : transactionState.data.fetchState,
                            refState.costCenters.fetchState,
                            refState.currencies.fetchState,
                            refState.transactionCodes.fetchState
                        ])
                    ) !== -1,
                isNew: isNewTransaction,
                isSaving,
                canEdit:
                    (transactionState
                        ? FetchingState.getDataOrDefault(
                              transactionState.data,
                              { canEdit: true }
                          ).canEdit
                        : true) && !isSaving,
                transactionId: ownProps.match.params.id,
                form,
                correlatedTransaction: transactionState
                    ? FetchingState.getDataOrDefault(transactionState.data, {
                          correlatedTransaction: null
                      }).correlatedTransaction
                    : null,
                transactionCorrelatedToThisTransaction: transactionState
                    ? FetchingState.getDataOrDefault(transactionState.data, {
                          transactionsCorrelatedToThisTransaction: []
                      }).transactionsCorrelatedToThisTransaction
                    : []
            };
        },
        (
            dispatch: Dispatch,
            ownProps: RouteComponentProps<{ id: string }>
        ): Partial<FinancialTransactionDetailsPageComponentProps> => ({
            formEvents: finTransactionFormBindings.bind(dispatch, {
                id: ownProps.match.params.id
            })
        }),
        undefined,
        {
            areOwnPropsEqual: createObjectComparer({
                comparerName: "FinancialTransactonDetails.ownProps"
            }),
            areStatePropsEqual: createObjectComparer({
                comparerName: "FinancialTransactionDetails.stateProps"
            })
        }
    ),
    setDisplayName("FinancialTransactionDetails")
)(FinancialTransactionDetailsPageComponent);
