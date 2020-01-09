import { call, put } from "redux-saga/effects";
import { HttpResult, ReduxHttpRequest, ReduxHttpRequestWithBody } from "rd-redux-http";

export function* runRequestAsSaga<TParams, TResult, TError = {}>(
    request: ReduxHttpRequest<TParams, TResult, TError>,
    params: TParams
): IterableIterator<any> {
    yield put(request.actions.running(params));

    const result: HttpResult<TResult, TError> = yield call(request, params);

    if (result.ok === true) {
        yield put(request.actions.ok(params, result));

        return result.result;
    } else {
        yield put(request.actions.error(params, result));
        throw result;
    }
}
export function* runRequestWithBodyAsSaga<TBody, TParams, TResult, TError = {}>(
    request: ReduxHttpRequestWithBody<TBody, TParams, TResult, TError>,
    params: TParams,
    body: TBody
): IterableIterator<any> {
    yield put(request.actions.running(params));

    const result: HttpResult<TResult, TError> = yield call(request, params, body);

    if (result.ok === true) {
        yield put(request.actions.ok(params, result));

        return result.result;
    } else {
        const errorAction = request.actions.error(params, result);
        yield put(errorAction);
        throw errorAction;
    }
}
