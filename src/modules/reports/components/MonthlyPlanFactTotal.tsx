import * as React from "react";
import * as cn from "classnames";

import { FinancialTransactionInfo } from "@fin";
import { PlanningEventInfo } from "@planning";
import { formatAmount } from "@utils";
import * as moment from "moment";
import "./MonthlyPlanFactTotal.less";

export interface MonthlyPlanFactTotalProps {
    month: string;
    transaction: FinancialTransactionInfo[];
    events: PlanningEventInfo[];
}

export function MonthlyPlanFactTotal({
    month,
    transaction,
    events
}: MonthlyPlanFactTotalProps) {
    return (
        <div className="MonthlyPlanFactTotal">
            <div className="MonthlyPlanFactTotal__head">
                {moment(month).format("MMMM YYYY")}
            </div>
            <div className="MonthlyPlanFactTotal__amounts">
                <Info className="plan" title="Plan:" items={events} />
                <Info className="fact" title="Fact:" items={transaction} />
            </div>
        </div>
    );
}

function Info(props: {
    title: string;
    items: Array<{ convertedAmount: number }>;
    className?: string;
}) {
    const totals = props.items.reduce(
        (result, item) => {
            return {
                income:
                    result.income +
                    (item.convertedAmount > 0 ? item.convertedAmount : 0),
                expence:
                    result.expence +
                    (item.convertedAmount < 0 ? item.convertedAmount : 0)
            };
        },
        {
            income: 0,
            expence: 0
        }
    );

    return (
        <div className={cn(props.className, "MonthlyPlanFactTotalInfo")}>
            <div className="MonthlyPlanFactTotalInfo__head">{props.title}</div>
            <div className="MonthlyPlanFactTotalInfo__amount income">
                {`In: ${formatAmount(totals.income)}`}
            </div>
            <div className="MonthlyPlanFactTotalInfo__amount expence">
                {`Out: ${formatAmount(totals.expence)}`}
            </div>
            <div
                className={cn("MonthlyPlanFactTotalInfo__amount total", {
                    negative: totals.income < totals.expence
                })}
            >
                {formatAmount(totals.income + totals.expence)}
            </div>
        </div>
    );
}
