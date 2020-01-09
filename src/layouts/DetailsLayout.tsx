import { Spin } from "antd";
import * as React from "react";
import { LayoutComponent, LayoutTabNames } from "./Layout";

export interface DetailsLayoutProps {
    isLoading: boolean;
    isSaving: boolean;
    children?: React.ReactChild | React.ReactChild[];
    activeTab: LayoutTabNames;
}

export function DetailsLayout({
    isLoading,
    isSaving,
    children,

    activeTab
}: DetailsLayoutProps) {
    return (
        <LayoutComponent activeTab={activeTab}>
            {(isLoading || isSaving) && <Spin />}
            {!isLoading && <div>{children}</div>}
        </LayoutComponent>
    );
}
