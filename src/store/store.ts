import { compose, createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import createHistory from "history/createBrowserHistory";
import { routerMiddleware } from "react-router-redux";
import { all } from "redux-saga/effects";
import {
    FinModuleState,
    financialModuleReducer,
    financialModuleSaga
} from "@fin";
import {
    PlanningModuleState,
    planningModuleReducer,
    planningModuleSaga
} from "@planning";
import {
    CustomAttributeModuleState,
    customAttributeModuleReducer
} from "@custom-attrs";
import { authSaga } from "./auth";
import { RefState, refsReducer, refsSaga } from "@ref";
import { ReportsState, reportsReducer, reportsSaga } from "@reports";

export interface AppState {
    fin: FinModuleState;
    planning: PlanningModuleState;
    refs: RefState;
    customAttrs: CustomAttributeModuleState;
    reports: ReportsState;
}

const composeEnhancers =
    (window as any)["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;
const sagaMiddleware = createSagaMiddleware();
export const browserHistory = createHistory();

export const store = createStore(
    combineReducers<AppState>({
        fin: financialModuleReducer,
        planning: planningModuleReducer,
        customAttrs: customAttributeModuleReducer,
        refs: refsReducer,
        reports: reportsReducer
    }),
    composeEnhancers(
        applyMiddleware(sagaMiddleware, routerMiddleware(browserHistory))
    )
);

sagaMiddleware.run(function*() {
    yield all([
        authSaga(),
        financialModuleSaga(),
        planningModuleSaga(),
        refsSaga(),
        reportsSaga()
    ]);
});
