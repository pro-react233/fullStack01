import { Field } from "@controls";
import { AppState } from "@store";
import { createObjectComparer, invert } from "@utils";
import {
    Button,
    Col as AntdCol,
    Input,
    Row as AntdRow,
    DatePicker
} from "antd";
import { ColProps } from "antd/lib/col";
import { RowProps } from "antd/lib/row";
import * as React from "react";
import { connect } from "react-redux";
import { compose, setDisplayName, shouldUpdate, withProps } from "recompose";
import { Dispatch } from "redux";
import {
    addScheduleAction,
    removeScheduleAction,
    scheduleForm,
    scheduleFormBindings,
    scheduleFormSelector
} from "../store";
import "./ScheduleForm.less";
import { CostCenterSelectList, CurrencySelectList } from "@ref";
import { CustomAttributeEditor } from "@custom-attrs";
import { ScheduleRuleSelectList } from "./ScheduleRuleSelectList";

export interface ScheduleFormComponentProps {
    form: typeof scheduleForm.types.selectorResult;
    events: typeof scheduleForm.types.eventBindings;
    onAddSchedule: () => void;
    onRemoveSchedule: () => void;
}

const Row = compose<RowProps, RowProps>(
    withProps({ gutter: 16 }),
    setDisplayName("RowCustom")
)(AntdRow);

const Col = compose<ColProps, ColProps>(setDisplayName("ColCustom"))(AntdCol);

function ScheduleFormComponent(props: ScheduleFormComponentProps) {
    const {
        form: { fields },
        events: { fields: fieldEvents },

        onAddSchedule,
        onRemoveSchedule
    } = props;

    return (
        <div className="ScheduleForm">
            <div className="ScheduleForm__button-container">
                <Button
                    shape="circle"
                    type="primary"
                    icon="plus"
                    size="small"
                    onClick={onAddSchedule}
                />
                <Button
                    shape="circle"
                    type="danger"
                    icon="delete"
                    size="small"
                    onClick={onRemoveSchedule}
                />
            </div>
            <Row>
                <Col xs={14}>
                    <Row>
                        <Col xs={16}>
                            <Field label="Name" field={fields.name}>
                                <Input
                                    value={fields.name.value || ""}
                                    {...fieldEvents.name}
                                    type="text"
                                />
                            </Field>
                        </Col>
                        <Col xs={8}>
                            <Field label="Active" field={fields.isActive}>
                                <Input
                                    checked={fields.isActive.value}
                                    onChange={e =>
                                        fieldEvents.isActive.onChange(
                                            e.currentTarget.checked
                                        )
                                    }
                                    type="checkbox"
                                />
                            </Field>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Field label="Start date" field={fields.startDate}>
                                <DatePicker
                                    value={fields.startDate.value || ""}
                                    format="DD MMM YYYY"
                                    onChange={fieldEvents.startDate.onChange}
                                    allowClear={false}
                                />
                            </Field>
                        </Col>
                        <Col xs={12}>
                            <Field label="End date" field={fields.endDate}>
                                <DatePicker
                                    value={fields.endDate.value || ""}
                                    format="DD MMM YYYY"
                                    onChange={fieldEvents.endDate.onChange}
                                />
                            </Field>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Field
                                label="Cost center"
                                field={fields.costCenterId}
                            >
                                <CostCenterSelectList
                                    value={fields.costCenterId.value || 0}
                                    {...fieldEvents.costCenterId}
                                />
                            </Field>
                        </Col>
                        <Col xs={12}>
                            <Field label="Currency" field={fields.currency}>
                                <CurrencySelectList
                                    value={fields.currency.value || ""}
                                    {...fieldEvents.currency}
                                />
                            </Field>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24}>
                            <Field label="Rule" field={fields.scheduleRule}>
                                <ScheduleRuleSelectList
                                    value={fields.scheduleRule.value || ""}
                                    {...fieldEvents.scheduleRule}
                                />
                            </Field>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24}>
                            <Field
                                label="Value Expression"
                                field={fields.valueExpression}
                            >
                                <Input
                                    value={fields.valueExpression.value || ""}
                                    {...fieldEvents.valueExpression}
                                    type="text"
                                />
                            </Field>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24}>
                            <Field
                                label="Schedule Settings"
                                field={fields.scheduleSettings}
                            >
                                <Input.TextArea
                                    value={fields.scheduleSettings.value || ""}
                                    {...fieldEvents.scheduleSettings}
                                />
                            </Field>
                        </Col>
                    </Row>
                </Col>
                <Col xs={10}>
                    <CustomAttributeEditor
                        value={fields.attributes.value || []}
                        {...fieldEvents.attributes}
                    />
                </Col>
            </Row>
        </div>
    );
}

export interface ScheduleFormProps {
    scheduleId: string;
    planId: string;
}

export const ScheduleForm = compose<
    ScheduleFormComponentProps,
    ScheduleFormProps
>(
    connect(
        (
            appState: AppState,
            ownProps: ScheduleFormProps
        ): Partial<ScheduleFormComponentProps> => ({
            form: scheduleFormSelector(
                appState,
                ownProps.planId,
                ownProps.scheduleId
            )
        }),

        (
            dispatch: Dispatch,
            ownProps: ScheduleFormProps
        ): Partial<ScheduleFormComponentProps> => ({
            events: scheduleFormBindings.bind(dispatch, {
                id: ownProps.planId,
                scheduleId: ownProps.scheduleId
            }),
            onAddSchedule: () =>
                dispatch(
                    addScheduleAction({
                        id: ownProps.planId,
                        addAfterScheduleId: ownProps.scheduleId
                    })
                ),
            onRemoveSchedule: () =>
                dispatch(
                    removeScheduleAction({
                        id: ownProps.planId,
                        scheduleId: ownProps.scheduleId
                    })
                )
        })
    ),
    setDisplayName("ScheduleForm"),
    shouldUpdate(
        invert(
            createObjectComparer({
                comparerName: "ScheduleForm",
                considerFunctionsEqual: true,
                debug: true,
                propertyComparers: {
                    form: createObjectComparer({
                        comparerName: "ScheduleForm.form",
                        considerFunctionsEqual: true,
                        debug: true
                    })
                }
            })
        )
    )
)(ScheduleFormComponent);
