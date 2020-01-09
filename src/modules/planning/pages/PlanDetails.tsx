import { Field, DataGrid, DataGridCol } from "@controls";
import { DetailsLayout } from "@layouts";
import { AppState } from "@store";
import { Button, Col, Form, Input, Row, Tabs } from "antd";
import { FormProps } from "rd-redux-forms";
import { FetchingState } from "rd-redux-http";
import * as React from "react";
import { connectAdvanced } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import { PlanFields, PlanningEventInfo } from "../api";
import { ScheduleForm } from "../components";
import {
    planForm,
    planFormBindings,
    scheduleIdSelector,
    addScheduleAction
} from "../store";
import { PlanListUrl } from "../urls";
import * as moment from "moment";
import { sort } from "@utils";

interface PlanDetailsPageComponentProps {
    planId: string;
    isLoading: boolean;
    isSaving: boolean;
    isNew: boolean;
    planForm: FormProps<PlanFields>;
    scheduleIdentifiers: string[];
    planningEvents: PlanningEventInfo[];
    planningEventsLoading: boolean;
    onAddSchedule: () => void;
}

function PlanDetailsPageComponent({
    planId,
    planForm,
    isLoading,
    isSaving,
    scheduleIdentifiers,
    planningEvents,
    planningEventsLoading,
    onAddSchedule
}: PlanDetailsPageComponentProps) {
    return (
        <DetailsLayout
            isLoading={isLoading}
            isSaving={isSaving}
            activeTab="plan"
        >
            <h2>
                {planId && planId !== "new" ? `Plan #${planId}` : "New Plan"}
            </h2>
            <Form {...planForm.formProps} layout="vertical">
                <Row gutter={16}>
                    <Col xs={12}>
                        <Field label="Name" field={planForm.fields.name}>
                            <Input
                                {...planForm.fields.name.input(true, "")}
                                type="text"
                            />
                        </Field>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col xs={12}>
                        <Field label="Active" field={planForm.fields.isActive}>
                            <Input
                                {...planForm.fields.isActive.checkbox(
                                    true,
                                    false
                                )}
                                type="checkbox"
                            />
                        </Field>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24}>
                        <Tabs>
                            <Tabs.TabPane tab="Schedules" key="s">
                                <Row gutter={16}>
                                    {scheduleIdentifiers.map(i => (
                                        <Col xs={12} key={i}>
                                            <ScheduleForm
                                                key={i}
                                                planId={planId}
                                                scheduleId={i}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Planning Events" key="e">
                                <DataGrid<PlanningEventInfo>
                                    loading={planningEventsLoading}
                                    items={planningEvents}
                                    page={0}
                                    pageSize={planningEvents.length}
                                    totalRecords={planningEvents.length}
                                    rowKey={e => e.id.toString()}
                                >
                                    <DataGridCol<PlanningEventInfo> header="#">
                                        {e => e.ordinal}
                                    </DataGridCol>
                                    <DataGridCol<PlanningEventInfo> header="At">
                                        {e =>
                                            moment(e.occurredAt).format(
                                                "YYYY MMM DD"
                                            )
                                        }
                                    </DataGridCol>
                                    <DataGridCol<
                                        PlanningEventInfo
                                    > header="Amount">
                                        {e => `${e.amount} ${e.currency}`}
                                    </DataGridCol>
                                    <DataGridCol<
                                        PlanningEventInfo
                                    > header="Schedule">
                                        {e => e.scheduleName}
                                    </DataGridCol>
                                    <DataGridCol<
                                        PlanningEventInfo
                                    > header="Cost Center">
                                        {e => e.costCenterName}
                                    </DataGridCol>
                                </DataGrid>
                            </Tabs.TabPane>
                        </Tabs>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12} className="Form__button-container">
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                        <Link
                            to={PlanListUrl.format({})}
                            className="ant-btn ant-btn-dashed"
                        >
                            Cancel
                        </Link>
                        <Button
                            type="default"
                            htmlType="button"
                            onClick={onAddSchedule}
                        >
                            Add schedule
                        </Button>
                    </Col>
                </Row>
            </Form>
        </DetailsLayout>
    );
}

export const PlanDetailsPage = connectAdvanced((dispatch: Dispatch) => {
    return (
        appState: AppState,
        ownProps: RouteComponentProps<{ id: string }>
    ): PlanDetailsPageComponentProps => {
        const planId = ownProps.match.params.id;
        const isNew = planId === "new";

        const state = appState.planning.planDetails.plans[planId];

        const planData = state
            ? FetchingState.getDataOrDefault(state.data, undefined)
            : undefined;

        const form = planFormBindings
            .bind(dispatch, { id: planId })
            .connect(
                planForm.selector(
                    state ? state.form : planForm.state.empty(),
                    planData ? planData.plan : undefined
                )
            );
        return {
            planId,
            isLoading:
                !isNew &&
                !!state &&
                FetchingState.isInitialOrFetching(state.data),
            isSaving: false,
            isNew,
            planForm: form,
            scheduleIdentifiers: scheduleIdSelector(appState, planId),
            planningEvents: sort<PlanningEventInfo>(
                FetchingState.getDataOrDefault(
                    appState.planning.planningEvents[planId],
                    []
                ),
                [e => e.occurredAt, "asc"]
            ),
            planningEventsLoading: FetchingState.isInitialOrFetching(
                appState.planning.planningEvents[planId]
            ),
            onAddSchedule: () =>
                dispatch(addScheduleAction({ id: ownProps.match.params.id }))
        };
    };
})(PlanDetailsPageComponent);
