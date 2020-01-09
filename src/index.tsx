import { browserHistory, store } from "@store";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "react-router-redux";
import { FinancialRoutes } from "@fin";
import { LayoutComponent } from "@layouts";
import { PlanningRoutes } from "@planning";

import "antd/dist/antd.css";
import "./styles/index.less";
import { Counter, TestPerformance } from "@components";
import { ReportingRoutes } from "@reports";

// whyDidYouUpdate(React, {
//     // exclude: [/^With.*/, /^Button\w*/gi] as any
// });

const App = () => (
    <LayoutComponent activeTab="fin">
        <TestPerformance>
            {/* <Counter>
                <TestPerformance>
                    <Counter />
                </TestPerformance>
            </Counter> */}
            <Counter />
        </TestPerformance>
    </LayoutComponent>
);

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory} store={store}>
            <Switch>
                {FinancialRoutes}
                {PlanningRoutes}
                {ReportingRoutes}
                <Route key="default" component={App} />
            </Switch>
        </Router>
    </Provider>,
    document.getElementById("root")
);
