import * as React from "react";
import { PlanFactFinResultsReportRecord } from "../api";
import "./MonthlyPlanFactResultsChart.less";
import { ProportionalContainer } from "@controls";
import * as d3 from "d3";
import * as cn from "classnames";
import * as moment from "moment";
import { Link } from "react-router-dom";
import { PlanFactFinancialResultsPageUrl } from "../urls";

export interface MonthlyPlanFactResultsChartProps {
    data: PlanFactFinResultsReportRecord[];
    selectedMonth?: string;
    onMonthSelected?: (month: string) => void;
}

export function MonthlyPlanFactResultsChart({
    data,
    selectedMonth
}: MonthlyPlanFactResultsChartProps) {
    const barData = React.useMemo(() => {
        const maxDomain = d3.max(data, a =>
            d3.max(
                [
                    a.factMonthlyExpence,
                    a.factMonthlyIncome,
                    a.planMonthlyExpence,
                    a.planMonthlyIncome,
                    a.planMonthlyTotal,
                    a.factMonthlyTotal
                ].map(Math.abs)
            )
        );

        const barScale = d3
            .scaleLinear()
            .domain([0, maxDomain])
            .range([0, 100]);

        const bar = (value: number, className: string) => ({
            value,
            className,
            height: barScale(Math.abs(value))
        });

        return {
            data: data.map(item => ({
                dataItem: item,
                bars: [
                    bar(
                        item.planMonthlyIncome,
                        cn("plan income", {
                            lower:
                                Math.abs(item.planMonthlyIncome) <
                                Math.abs(item.factMonthlyIncome)
                        })
                    ),
                    bar(
                        item.factMonthlyIncome,
                        cn("fact income", {
                            lower:
                                Math.abs(item.factMonthlyIncome) <
                                Math.abs(item.planMonthlyIncome)
                        })
                    ),
                    bar(
                        item.planMonthlyExpence,
                        cn("plan expence", {
                            lower:
                                Math.abs(item.planMonthlyExpence) <
                                Math.abs(item.factMonthlyExpence)
                        })
                    ),

                    bar(
                        item.factMonthlyExpence,
                        cn("fact expence", {
                            lower:
                                Math.abs(item.factMonthlyExpence) <
                                Math.abs(item.planMonthlyExpence)
                        })
                    ),
                    bar(
                        item.planMonthlyTotal,
                        cn("plan total expence", {
                            negative: item.planMonthlyTotal < 0
                        })
                    ),
                    bar(
                        item.factMonthlyTotal,
                        cn("fact total expence", {
                            negative: item.factMonthlyTotal < 0
                        })
                    )
                ].filter(i => !!i && !!i.value)
            }))
        };
    }, [data]);

    return (
        <ProportionalContainer>
            <span className="MonthlyPlanFactResultsBarChart">
                {barData.data.map(entry => (
                    <Link
                        to={PlanFactFinancialResultsPageUrl.format({
                            month: moment(
                                entry.dataItem.occurredAtMonth
                            ).format("YYYY-MM-DD")
                        })}
                        className={cn(
                            "MonthlyPlanFactResultsBarChart__item MonthlyPlanFactResultsBar",
                            {
                                selected:
                                    moment(
                                        entry.dataItem.occurredAtMonth
                                    ).format("YYYY-MM-DD") === selectedMonth
                            }
                        )}
                        key={entry.dataItem.occurredAtMonth}
                    >
                        <span className="MonthlyPlanFactResultsBar__bar-container">
                            {entry.bars.map(bar => (
                                <span
                                    title={bar.value.toFixed(2)}
                                    className={cn(
                                        "MonthlyPlanFactResultsBar__metric",
                                        bar.className
                                    )}
                                    key={bar.className}
                                    style={{
                                        height: `${bar.height}%`
                                    }}
                                >
                                    {/* <span className="MonthlyPlanFactResultsBar__value">
                                        {bar.value.toFixed(2)}
                                    </span> */}
                                </span>
                            ))}
                        </span>
                        <span className="MonthlyPlanFactResultsBar__info-container">
                            {moment(entry.dataItem.occurredAtMonth).format(
                                "MMM YYYY"
                            )}
                        </span>
                    </Link>
                ))}
            </span>
        </ProportionalContainer>
    );
}
