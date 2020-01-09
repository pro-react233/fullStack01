import { getCostCenterListRequest, getCurrencyListRequest, getTransactionCodeListRequest } from "../api";
import { AppState } from "@store";
import { runRequestAsSaga } from "@store/utils";
import { FetchingState } from "rd-redux-http";
import { all, select } from "redux-saga/effects";
import { getCustomAttributeSetRequest } from "@custom-attrs";

export function* refsSaga() {
    const appState: AppState = yield select();
    const refState = appState.refs;
    const customAttrState = appState.customAttrs.customAttributes;

    const dataPairs = [
        {
            state: refState.costCenters,
            request: getCostCenterListRequest
        },
        {
            state: refState.currencies,
            request: getCurrencyListRequest
        },
        {
            state: refState.transactionCodes,
            request: getTransactionCodeListRequest
        },
        {
            state: customAttrState,
            request: getCustomAttributeSetRequest
        }
    ];

    const requestsToRun = dataPairs
        .filter(p => FetchingState.isInitial(p.state as any))
        .map(p => runRequestAsSaga(p.request as any, {}));

    if (requestsToRun.length) {
        yield all(requestsToRun);
    }
}
