import { LocationChangeAction } from "react-router-redux";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { getTransactionListRequest } from "../../api";
import { FinTransactionListUrl } from "../../urls";

function* loadTransactions(action: LocationChangeAction) {
    const match = FinTransactionListUrl.match(action.payload, true);

    if (match.isMatched) {
        const params = match.query;

        yield put(getTransactionListRequest.actions.running(params));

        const response: typeof getTransactionListRequest.types.response = yield call(getTransactionListRequest, params);

        if (response.ok) {
            yield put(getTransactionListRequest.actions.ok(params, response));
        } else {
            yield put(getTransactionListRequest.actions.error(params, response as any));
        }
    }
}

export function* financialTransactionListSaga() {
    yield all([
        takeEvery((a: LocationChangeAction) => FinTransactionListUrl.match(a.payload, true).isMatched, loadTransactions)
    ]);
}
