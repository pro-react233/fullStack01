import * as React from "react";
import { PlanInfo } from "../api";
import { GenericList } from "@components";
import { PlanListUrl, PlanDetailsUrl } from "../urls";
import { DataGridCol } from "@controls";
import { Link } from "react-router-dom";
import { Icon } from "antd";

export function PlanListPage(_props: {}) {
    return (
        <GenericList<PlanInfo>
            newItemUrl={PlanDetailsUrl.format({
                id: "new"
            })}
            title="Plan list"
            pageUrl={PlanListUrl}
            stateAccessor={state => state.planning.planList}
            rowKey={i => i.id.toString()}
            activeTab="plan"
        >
            <DataGridCol<PlanInfo> header="ID" sortsBy="id">
                {item => (
                    <Link to={PlanDetailsUrl.format({ id: `${item.id}` })}>
                        {item.id}
                    </Link>
                )}
            </DataGridCol>
            <DataGridCol<PlanInfo> header="Name" sortsBy="name">
                {item => item.name}
            </DataGridCol>
            <DataGridCol<PlanInfo> header="Is Active" sortsBy="isActive">
                {item => (item.isActive ? "Yes" : "No")}
            </DataGridCol>
            <DataGridCol<PlanInfo> header="Actions">
                {item => (
                    <Link
                        to={PlanDetailsUrl.format(
                            { id: "new" },
                            { copyFromPlan: item.id.toString() }
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
