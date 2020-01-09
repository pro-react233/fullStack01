import { ListRequest, PageResult } from "@api/common";
import {
    ReduxHttpRequest,
    ReduxHttpRequestState,
    FetchingState
} from "rd-redux-http";
import { Reducer } from "react";
import { Action } from "redux";
import { takeEvery, put, call } from "redux-saga/effects";
import { LocationChangeAction } from "react-router-redux";
import { UrlPath } from "rd-url-utils";

export function createGenericList<TItem, TSortableFields>(
    request: ReduxHttpRequest<ListRequest<TSortableFields>, PageResult<TItem>>,
    pageUrl: UrlPath<{}, ListRequest<TSortableFields>>
): StandardListAssets<TItem, TSortableFields> {
    return {
        defaultState: {
            fetchState: FetchingState.INITIAL
        },
        reducer: request.reducer,

        saga: function* standardListSaga() {
            yield takeEvery(
                (action: LocationChangeAction) =>
                    pageUrl.match(action.payload, true).isMatched,
                function* loadStandardListSaga(action: LocationChangeAction) {
                    const match = pageUrl.match(action.payload, true);

                    if (match.isMatched) {
                        const params = match.query;

                        yield put(request.actions.running(params));

                        const response: typeof request.types.response = yield call(
                            request,
                            params
                        );

                        if (response.ok) {
                            yield put(request.actions.ok(params, response));
                        } else {
                            yield put(
                                request.actions.error(params, response as any)
                            );
                        }
                    }
                }
            );
        }
    };
}

export interface StandardListAssets<TItem, TSortableFields> {
    defaultState: ListState<TItem, TSortableFields>;
    reducer: Reducer<ListState<TItem, TSortableFields>, Action>;
    saga: () => IterableIterator<any>;
}

export type ListState<TItem, TSortableFields> = ReduxHttpRequestState<
    ListRequest<TSortableFields>,
    PageResult<TItem>,
    any
>;
