import * as React from "react";
import "./PlanningFinancialResultsChart.less";
import { MonthlyFinancialResultsRecord } from "../api";
import * as d3 from "d3";
import * as moment from "moment";
import { AutoScaleSvg } from "@components";

const MONTH_RELATIVE_WIDTH = 50;
const HEIGHT = 100;

export interface PlanningFinancialResultsChartProps {
    data: MonthlyFinancialResultsRecord[];
}

export function PlanningFinancialResultsChart({
    data
}: PlanningFinancialResultsChartProps) {
    const chartWidth = MONTH_RELATIVE_WIDTH * data.length;
    const maxAmount = data.reduce(
        (max, event) =>
            Math.max(
                max,
                Math.abs(event.monthlyTotalExpence),
                Math.abs(event.monthlyTotalIncome)
            ),
        0
    );

    const minAmount = data.reduce(
        (min, event) => Math.min(min, event.monthlyTotal),
        0
    );

    const y = d3
        .scaleLinear()
        .domain([minAmount, maxAmount])
        .range([HEIGHT - 10, 10]);

    const x = d3
        .scaleTime()
        .domain(d3.extent(data, e => new Date(e.month)))
        .range([0, chartWidth]);

    const lineBuilder = d3
        .line<ElementType<typeof data>>()
        .curve(d3.curveCardinal.tension(0))
        .x(v => x(new Date(v.month)));

    const areaBuilder = d3
        .area<ElementType<typeof data>>()
        .curve(d3.curveCardinal.tension(0))
        .x(v => x(new Date(v.month)))
        .y0(y(0));

    return (
        <AutoScaleSvg
            className="PlanningFinancialResultsChart"
            viewportHeight={HEIGHT}
            viewportWidth={chartWidth}
        >
            <path
                className="PlanningFinancialResultsChart__line zero-line"
                d={lineBuilder.y(v => y(0))(data)}
            />
            <path
                className="PlanningFinancialResultsChart__line income"
                d={areaBuilder.y1(v => y(v.monthlyTotalIncome))(data)}
            />
            <path
                className="PlanningFinancialResultsChart__line expence"
                d={areaBuilder.y1(v => y(Math.abs(v.monthlyTotalExpence)))(
                    data
                )}
            />
            <path
                className="PlanningFinancialResultsChart__line total"
                d={areaBuilder.y1(v => y(v.monthlyTotal))(data)}
            />
            {/* <path
                className="PlanningFinancialResultsChart__line sliding-total"
                d={lineBuilder.y(v => y(v.monthlySlidingTotal))(data)}
            /> */}
            {data.map(v => (
                <React.Fragment key={`date-text-${v.month}`}>
                    {/* Ticks */}
                    <line
                        x1={x(new Date(v.month))}
                        y1={y(0)}
                        x2={x(new Date(v.month))}
                        y2={y(0) + 1.5}
                        className="PlanningFinancialResultsChart__tick date"
                    />
                    <text
                        y={y(0) + 4}
                        x={x(new Date(v.month))}
                        className="PlanningFinancialResultsChart__text month"
                    >
                        {moment(v.month).format("MMM YYYY")}
                    </text>
                    {/* Income */}
                    <circle
                        cx={x(new Date(v.month))}
                        cy={y(v.monthlyTotalIncome)}
                        r={0.3}
                        className="PlanningFinancialResultsChart__dot income"
                    />
                    <text
                        x={x(new Date(v.month))}
                        y={
                            y(v.monthlyTotalIncome) +
                            (v.monthlyTotalIncome >
                            Math.abs(v.monthlyTotalExpence)
                                ? -1
                                : 3)
                        }
                        className="PlanningFinancialResultsChart__text income"
                    >
                        {v.monthlyTotalIncome.toFixed(2)}
                    </text>
                    {/* Expence */}
                    <circle
                        cx={x(new Date(v.month))}
                        cy={y(Math.abs(v.monthlyTotalExpence))}
                        r={0.3}
                        className="PlanningFinancialResultsChart__dot expence"
                    />
                    <text
                        x={x(new Date(v.month))}
                        y={
                            y(Math.abs(v.monthlyTotalExpence)) +
                            (v.monthlyTotalIncome >
                            Math.abs(v.monthlyTotalExpence)
                                ? 3
                                : -1)
                        }
                        className="PlanningFinancialResultsChart__text expence"
                    >
                        {v.monthlyTotalExpence.toFixed(2)}
                    </text>
                    {/* Total */}
                    <circle
                        cx={x(new Date(v.month))}
                        cy={y(v.monthlyTotal)}
                        r={0.3}
                        className="PlanningFinancialResultsChart__dot total"
                    />
                    <text
                        x={x(new Date(v.month))}
                        y={y(v.monthlyTotal) - 1}
                        className="PlanningFinancialResultsChart__text total"
                    >
                        {v.monthlyTotal.toFixed(2)}
                    </text>
                </React.Fragment>
            ))}
        </AutoScaleSvg>
    );
}

type ElementType<T> = T extends Array<infer E> ? E : never;
