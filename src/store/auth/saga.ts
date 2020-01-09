import { Action } from "redux";
import { LOCATION_CHANGE, LocationChangeAction } from "react-router-redux";
import { all, takeEvery } from "redux-saga/effects";
import * as qs from "querystring";
import { storeTokens, StoreTokenUrl } from "@api/common";

function storeAccessToken(a: LocationChangeAction) {
    if (a.payload.hash) {
        const hash = a.payload.hash.replace(/^#/, "");
        const parsedHash = qs.parse(hash);

        if (parsedHash.access_token) {
            storeTokens({
                auth_token: parsedHash.access_token as string,
                refresh_token: ""
            });

            const redirectUrl = parsedHash.state as string;
            if (redirectUrl) {
                window.location.assign(decodeURIComponent(redirectUrl));
            }
        }
    }
}

export function* authSaga() {
    yield all([
        takeEvery(
            (a: Action) =>
                a.type === LOCATION_CHANGE && StoreTokenUrl.match((a as LocationChangeAction).payload, false).isMatched,
            storeAccessToken
        )
    ]);
}
