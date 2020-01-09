import {
    ListRequest,
    listRequestFromQuery,
    PageResult,
    pagingFromListRequest,
    PagingInfo,
    toListRequest
} from "@api/common";
import { DataGrid, DataGridColProps, SearchBar } from "@controls";
import { LayoutComponent, LayoutTabNames } from "@layouts";
import { AppState, ListState } from "@store";
import { Col, Icon, Row, Alert } from "antd";
import { FetchingState } from "rd-redux-http";
import { UrlPath } from "rd-url-utils";
import * as React from "react";
import { connect } from "react-redux";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Dispatch } from "redux";
import "./GenericListPage.less";

interface GenericListComponentProps<TItem> {
    title: string;
    isLoading: boolean;
    items: PageResult<TItem>;
    paging: PagingInfo;
    newItemUrl: string;
    activeTab: LayoutTabNames;
    rowKey: (item: TItem, index?: number) => string;
    rowClassName?: (item: TItem, index?: number) => string;
    error?: string;

    children: React.ReactElement<DataGridColProps<TItem>>[];

    onNavigateGrid?: (info: Partial<PagingInfo>) => void;
}

function GenericListComponent<TItem>(props: GenericListComponentProps<TItem>) {
    const { newItemUrl, error } = props;
    return (
        <LayoutComponent activeTab={props.activeTab}>
            <h2>{props.title}</h2>
            <Row>
                <Col xs={22}>
                    <SearchBar
                        value={props.paging.search}
                        onChange={search =>
                            props.onNavigateGrid &&
                            props.onNavigateGrid({ search })
                        }
                    />
                </Col>

                <Col xs={2} className="GenericListPage__command-column">
                    <Link to={newItemUrl} className="ant-btn ant-btn-primary">
                        <Icon type="plus" />
                        Add
                    </Link>
                </Col>
            </Row>
            {error && (
                <Row>
                    <Col>
                        <Alert type="error" message={error} />
                    </Col>
                </Row>
            )}
            <Row>
                <Col>
                    <div className="GenericListPage__table">
                        <DataGrid
                            loading={props.isLoading}
                            items={props.items ? props.items.data : []}
                            params={props.paging}
                            page={props.paging.page}
                            pageSize={props.paging.pageSize}
                            totalRecords={props.paging.totalRecords}
                            onNavigateGrid={props.onNavigateGrid}
                            rowKey={props.rowKey}
                            rowClassName={props.rowClassName}
                        >
                            {props.children}
                        </DataGrid>
                    </div>
                </Col>
            </Row>
        </LayoutComponent>
    );
}

export interface GenericListProps<TItem> {
    pageUrl: UrlPath<{}, ListRequest<any>>;
    title: string;
    newItemUrl: string;
    children: React.ReactElement<DataGridColProps<TItem>>[];
    activeTab: LayoutTabNames;
    stateAccessor: (appState: AppState) => ListState<TItem, any>;
    rowKey: (item: TItem, index?: number) => string;
    rowClassName?: (item: TItem, index?: number) => string;
}

export class GenericList<TItem> extends React.Component<
    GenericListProps<TItem>
> {
    render() {
        const {
            children,
            newItemUrl,
            pageUrl,
            stateAccessor,
            title,
            activeTab,
            rowClassName,
            rowKey
        } = this.props;
        const listComponent = GenericListComponent;

        const ConnectedList = withRouter(
            connect(
                (state: AppState, ownProps: RouteComponentProps<any>) => {
                    const dataState = stateAccessor(state);
                    const match = pageUrl.match(ownProps.location, true);

                    return {
                        title,
                        newItemUrl,
                        children,
                        activeTab,
                        isLoading: FetchingState.isInitialOrFetching(dataState),
                        items: FetchingState.getDataOrDefault(
                            dataState,
                            undefined
                        ),
                        error: FetchingState.isError(dataState)
                            ? "Error loading data"
                            : undefined,
                        paging: pagingFromListRequest(
                            listRequestFromQuery(
                                match.isMatched ? match.query : {}
                            ),
                            (
                                FetchingState.getDataOrDefault(
                                    dataState,
                                    undefined
                                ) || { total: 0 }
                            ).total
                        ),
                        rowKey,
                        rowClassName
                    } as Partial<GenericListComponentProps<TItem>>;
                },
                (_: Dispatch, ownProps: RouteComponentProps<any>) =>
                    ({
                        onNavigateGrid: (info: Partial<PagingInfo>) => {
                            const match = this.props.pageUrl.match(
                                ownProps.location,
                                true
                            );
                            if (match.isMatched) {
                                const listPaging = listRequestFromQuery(
                                    match.query
                                );
                                const pagingInfo = pagingFromListRequest(
                                    listPaging,
                                    1000
                                );

                                const newUrl = this.props.pageUrl.format(
                                    {},
                                    toListRequest({
                                        ...pagingInfo,
                                        ...info
                                    })
                                );

                                ownProps.history.push(newUrl);
                            }
                        }
                    } as Partial<GenericListComponentProps<TItem>>)
            )(listComponent as any)
        );

        return <ConnectedList />;
    }
}
