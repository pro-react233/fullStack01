import { FinTransactionDetailsUrl, getTransactionDetailsRequest } from "@fin";
import { FinancialTransactionInfo } from "modules/fin/api";
import { LocationChangeAction } from "react-router-redux";
import { call, put } from "redux-saga/effects";
import { copyTransactionAction } from "../actions";

export function* loadTransactionDetailsOnNavigatingToPage(
    action: LocationChangeAction
) {
    const match = FinTransactionDetailsUrl.match(action.payload, true);
    if (!match.isMatched) {
        return;
    }

    if (match.params.id === "new") {
        if (match.query && match.query.copyFromTransaction) {
            const transaction: FinancialTransactionInfo = yield* loadTransactionById(
                match.query.copyFromTransaction
            );

            if (transaction) {
                yield put(
                    copyTransactionAction({
                        copyFromTransaction: transaction
                    })
                );
            }
        }
    } else {
        yield* loadTransactionById(match.params.id);
    }
}

function* loadTransactionById(id: string) {
    const params = { id };

    yield put(getTransactionDetailsRequest.actions.running(params));

    const result: typeof getTransactionDetailsRequest.types.response = yield call(
        getTransactionDetailsRequest,
        params
    );

    if (result.ok) {
        yield put(getTransactionDetailsRequest.actions.ok(params, result));
        return result.result;
    } else {
        yield put(
            getTransactionDetailsRequest.actions.error(params, result as any)
        );

        return undefined;
    }
}
