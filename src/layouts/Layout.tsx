import { FinTransactionListUrl } from "@fin";
import { PlanListUrl } from "@planning";
import { Layout, Menu } from "antd";
import * as React from "react";
import { Link } from "react-router-dom";
import "./Layout.less";
import * as img from "./logo-white.png";
import {
    PlanningFinancialResultsPageUrl,
    PlanFactFinancialResultsPageUrl
} from "@reports";

export type LayoutTabNames =
    | "fin"
    | "plan"
    | "reports.plan-fact-fin-results"
    | "reports.planning-results";

export interface LayoutComponentProps {
    children?: React.ReactChild | React.ReactChild[];
    activeTab: LayoutTabNames;
}

export function LayoutComponent({ children, activeTab }: LayoutComponentProps) {
    return (
        <Layout className="layout">
            <Layout.Header className="header">
                <Link
                    className="logo"
                    to={PlanningFinancialResultsPageUrl.format({})}
                >
                    <img className="logo__img" alt="RD ERP" src={img} />
                </Link>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    style={{ lineHeight: "64px" }}
                    selectedKeys={[activeTab]}
                >
                    <Menu.Item key="fin">
                        <Link to={FinTransactionListUrl.format({})}>
                            Transactions
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="plan">
                        <Link to={PlanListUrl.format({})}>Plans</Link>
                    </Menu.Item>
                    <Menu.SubMenu title="Reports">
                        <Menu.ItemGroup title="Financial">
                            <Menu.Item key="reports.planning-results">
                                <Link
                                    to={PlanningFinancialResultsPageUrl.format(
                                        {}
                                    )}
                                >
                                    Planning financial results
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="reports.plan-fact-fin-results">
                                <Link
                                    to={PlanFactFinancialResultsPageUrl.format(
                                        {}
                                    )}
                                >
                                    Plan/Fact financial results
                                </Link>
                            </Menu.Item>
                        </Menu.ItemGroup>
                    </Menu.SubMenu>
                </Menu>
            </Layout.Header>
            <Layout.Content className="content">{children}</Layout.Content>
        </Layout>
    );
}
