import * as React from "react";
import { Route } from "react-router";
import { PlanDetailsPage, PlanListPage } from "./pages";
import { PlanDetailsUrl, PlanListUrl } from "./urls";

export const PlanningRoutes = [
    <Route
        key={PlanListUrl.urlTemplate}
        exact
        path={PlanListUrl.urlTemplate}
        component={PlanListPage}
    />,
    <Route
        key={PlanDetailsUrl.urlTemplate}
        exact
        path={PlanDetailsUrl.urlTemplate}
        component={PlanDetailsPage}
    />
];
