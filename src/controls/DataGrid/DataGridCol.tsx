import { PagingInfo } from "@api/common";
import * as React from "react";

export interface DataGridColProps<TItem> {
    sortsBy?: keyof TItem;

    numeric?: boolean;

    header?: string;
    renderHeader?: (params: PagingInfo) => React.ReactChild;

    cellClassName?: (item: TItem) => string;

    children: (item: TItem) => React.ReactChild;
}

export function DataGridCol<TItem>(
    props: DataGridColProps<TItem>
): JSX.Element {
    return null;
}
