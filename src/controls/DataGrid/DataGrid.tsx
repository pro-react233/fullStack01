import { PagingInfo } from "@api/common";
import { Table } from "antd";
import * as React from "react";
import { DataGridColProps } from "./DataGridCol";
export interface DataGridProps<TItem> {
    items: TItem[];
    rowKey: (item: TItem, index?: number) => string;
    rowClassName?: (item: TItem, index?: number) => string;
    params?: PagingInfo;
    children: React.ReactElement<DataGridColProps<TItem>>[];
    className?: string;

    loading: boolean;

    page: number;
    pageSize: number;
    totalRecords: number;

    onNavigateGrid?: (newParams: Partial<PagingInfo>) => void;
}

export function DataGrid<TItem>({
    items,
    children,
    className,
    page,
    pageSize,
    totalRecords,
    params,
    loading,
    rowKey,
    rowClassName,
    onNavigateGrid
}: DataGridProps<TItem>) {
    const cols = (React.Children.toArray(children) as React.ReactElement<
        DataGridColProps<TItem>
    >[]).map(c => c.props);

    return (
        <Table
            loading={loading}
            dataSource={items || []}
            className={className}
            pagination={{
                current: page,
                pageSize,
                total: totalRecords
            }}
            rowKey={rowKey}
            rowClassName={rowClassName}
            size="small"
            onChange={(paging, _filters, sorting) => {
                onNavigateGrid &&
                    onNavigateGrid({
                        ...params,
                        page: paging.current,
                        sortBy:
                            sorting && sorting.columnKey
                                ? (cols[+sorting.columnKey].sortsBy as any)
                                : undefined,
                        sortDirection:
                            sorting && sorting.columnKey
                                ? sorting.order === "ascend"
                                    ? "asc"
                                    : "desc"
                                : undefined
                    });
            }}
            bordered
        >
            {cols.map((c, index) => (
                <Table.Column
                    key={index.toString()}
                    title={c.header}
                    align={c.numeric ? "right" : "left"}
                    sorter={!!c.sortsBy}
                    sortOrder={
                        c.sortsBy &&
                        params.sortBy &&
                        params.sortBy === c.sortsBy
                            ? params.sortDirection === "desc"
                                ? "descend"
                                : "ascend"
                            : undefined
                    }
                    render={(_, item: TItem) => c.children(item)}
                />
            ))}
        </Table>
    );
}
